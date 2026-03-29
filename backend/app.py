import os
import sys

# --- ENVIRONMENT FIXES ---
# Force Python-mode protobuf to avoid mediapipe/TF version conflict
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

# TensorFlow in this environment is corrupted (disk-full install).
# The analysis pipeline uses only PyTorch + MediaPipe Tasks API (tflite-based),
# so we stub TF before mediapipe loads. We give the stub a real ModuleSpec so
# importlib spec-checks inside mediapipe don't raise ValueError.
import types as _types
import importlib.machinery as _machinery

def _make_tf_stub(name):
    mod = _types.ModuleType(name)
    mod.__spec__ = _machinery.ModuleSpec(name, None)
    mod.__version__ = "2.10.1"
    mod.__path__ = []
    return mod

if "tensorflow" not in sys.modules:
    for _name in [
        "tensorflow", "tensorflow.python", "tensorflow.python.framework",
        "tensorflow.python.framework.ops", "tensorflow.python.eager",
        "tensorflow.python.eager.context", "tensorflow.compat",
        "tensorflow.compat.v1", "tensorflow.compat.v2",
        "tensorflow.core", "tensorflow.io",
    ]:
        sys.modules[_name] = _make_tf_stub(_name)

import cv2
import torch
import torch.nn as nn
from torchvision import transforms, models
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import tempfile
import shutil

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# --- CONFIG ---
# Paths relative to this file's location (the backend directory)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(BASE_DIR, 'fine_tuned_v4.pth')
MODEL_PATH = os.path.join(BASE_DIR, 'blaze_face_short_range.tflite')
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
SKIP_FRAMES = 3

# --- STARTUP: Load model once when the server starts ---
print(f"Loading model on {DEVICE}...")
model = models.vit_b_16(weights=None)
model.heads.head = nn.Sequential(nn.Dropout(0.4), nn.Linear(model.heads.head.in_features, 1))
model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=DEVICE))
model = model.to(DEVICE).eval()
print("Model loaded successfully.")

base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
detector = vision.FaceDetector.create_from_options(
    vision.FaceDetectorOptions(base_options=base_options)
)

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# --- FASTAPI APP ---
app = FastAPI(title="Deepfake Detection API")

# Allow the React dev server (port 3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def analyze_video_file(video_path: str):
    """
    Core analysis logic extracted from df1.py.
    Returns a dict with verdict, confidence, and per-frame data.
    """
    vid = cv2.VideoCapture(video_path)
    fps = vid.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        fps = 30  # fallback

    frame_indices = []   # time in seconds
    frame_scores = []    # suspicion scores
    frame_numbers = []   # exact frame number
    frame_thumbnails = [] # base64 encoded thumbnails

    with torch.no_grad():
        while True:
            success, frame = vid.read()
            if not success:
                break

            current_frame = int(vid.get(cv2.CAP_PROP_POS_FRAMES))

            if current_frame % SKIP_FRAMES == 0:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
                results = detector.detect(mp_image)

                if results.detections:
                    bbox = results.detections[0].bounding_box
                    size = int(max(bbox.width, bbox.height) * 1.3)
                    cx = bbox.origin_x + bbox.width // 2
                    cy = bbox.origin_y + bbox.height // 2
                    x1 = max(0, cx - size // 2)
                    y1 = max(0, cy - size // 2)
                    face = frame[y1:y1 + size, x1:x1 + size]

                    if face.size > 0:
                        img = transform(face).unsqueeze(0).to(DEVICE)
                        prediction = torch.sigmoid(model(img)).item()
                        suspicion_score = 1 - prediction  # 1=Fake, 0=Real

                        frame_indices.append(round(current_frame / fps, 3))
                        frame_numbers.append(current_frame)
                        frame_scores.append(round(suspicion_score, 4))
                        
                        # Generate optimized base64 thumbnail for frontend telemetry graph
                        import base64
                        h, w = frame.shape[:2]
                        new_w = 180
                        new_h = int(h * (new_w / w))
                        thumb = cv2.resize(frame, (new_w, new_h))
                        _, buffer = cv2.imencode('.jpg', thumb, [int(cv2.IMWRITE_JPEG_QUALITY), 60])
                        b64_str = base64.b64encode(buffer).decode('utf-8')
                        frame_thumbnails.append(b64_str)

    vid.release()

    if not frame_scores:
        raise ValueError("No faces detected in the video. Please upload a video containing a visible human face.")

    avg_suspicion = float(np.mean(frame_scores))
    peak_suspicion = float(np.max(frame_scores))

    # Verdict: fake if peak is very high AND average is high
    is_fake = peak_suspicion > 0.90 and avg_suspicion > 0.60
    verdict = "FAKE" if is_fake else "REAL"
    confidence = peak_suspicion if is_fake else (1 - avg_suspicion)

    # Build per-frame data for the telemetry chart
    # Format: [{ "frame": <time_in_seconds>, "probability": <suspicion_score>, "thumbnail": <base64> }, ...]
    frame_data = [
        {"frame": t, "probability": s, "frame_num": n, "thumbnail": thumb}
        for t, s, n, thumb in zip(frame_indices, frame_scores, frame_numbers, frame_thumbnails)
    ]

    return {
        "prediction": verdict,
        "confidence": round(confidence, 4),
        "avg_suspicion": round(avg_suspicion, 4),
        "peak_suspicion": round(peak_suspicion, 4),
        "frame_data": frame_data,
    }


@app.post("/analyze-video")
async def analyze_video(file: UploadFile = File(...)):
    """
    Accepts a video file upload, runs deepfake detection, and returns the result.
    """
    # Validate file type
    allowed_extensions = {".mp4", ".avi", ".mov"}
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Please upload an MP4, AVI, or MOV file."
        )

    # Save upload to a temp file
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        result = analyze_video_file(tmp_path)
        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.get("/health")
def health_check():
    return {"status": "ok", "device": str(DEVICE)}