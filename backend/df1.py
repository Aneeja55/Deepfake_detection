import cv2
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
from torchvision import transforms, models
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
import os

# --- CONFIG ---
WEIGHTS_PATH = 'fine_tuned_v4.pth' # USE V4 FOR BETTER DISCRIMINATION
MODEL_PATH = 'blaze_face_short_range.tflite'
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
VIDEO_TO_TEST = 'Video-29.mp4' 
SKIP_FRAMES = 3  

# 1. Model & Detector Setup
model = models.vit_b_16(weights=None)
model.heads.head = nn.Sequential(nn.Dropout(0.4), nn.Linear(model.heads.head.in_features, 1))
model.load_state_dict(torch.load(WEIGHTS_PATH, map_location=DEVICE))
model = model.to(DEVICE).eval()

base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
detector = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(base_options=base_options))

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def generate_suspicion_graph(video_path):
    vid = cv2.VideoCapture(video_path)
    fps = vid.get(cv2.CAP_PROP_FPS)
    frame_indices = []
    frame_scores = []
    
    print(f"Analyzing: {os.path.basename(video_path)}...")

    with torch.no_grad():
        while True:
            success, frame = vid.read()
            if not success: break
            
            current_frame = int(vid.get(cv2.CAP_PROP_POS_FRAMES))
            
            if current_frame % SKIP_FRAMES == 0:
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=frame_rgb)
                results = detector.detect(mp_image)
                
                if results.detections:
                    bbox = results.detections[0].bounding_box
                    size = int(max(bbox.width, bbox.height) * 1.3)
                    cx, cy = bbox.origin_x + bbox.width//2, bbox.origin_y + bbox.height//2
                    x1, y1 = max(0, cx - size//2), max(0, cy - size//2)
                    face = frame[y1:y1+size, x1:x1+size]
                    
                    if face.size > 0:
                        img = transform(face).unsqueeze(0).to(DEVICE)
                        # LOGIC: Model outputs 1 for Real, 0 for Fake. 
                        # We want score to be "Suspicion" (1=Fake, 0=Real)
                        prediction = torch.sigmoid(model(img)).item()
                        suspicion_score = 1 - prediction 
                        
                        frame_indices.append(current_frame / fps) 
                        frame_scores.append(suspicion_score)

    vid.release()

    if not frame_scores:
        print("Error: No faces detected.")
        return

    # --- FORENSIC METRICS ---
    avg_suspicion = np.mean(frame_scores)
    peak_suspicion = np.max(frame_scores)
    
    # Verdict Logic: If any part is highly suspicious OR average is high
    is_fake = peak_suspicion > 0.90 and avg_suspicion > 0.60
    verdict = "FAKE" if is_fake else "REAL"
    confidence = peak_suspicion if is_fake else (1 - avg_suspicion)

    # --- PLOTTING ---
    plt.figure(figsize=(12, 7))
    plt.style.use('seaborn-v0_8-darkgrid') 
    
    plt.plot(frame_indices, frame_scores, color='#e74c3c', linewidth=2, label='Suspicion Level')
    plt.axhline(y=0.5, color='black', linestyle='--', alpha=0.3)
    
    # Background color coding
    plt.fill_between(frame_indices, 0.5, 1.0, color='red', alpha=0.1, label='Suspected Manipulation')
    plt.fill_between(frame_indices, 0.0, 0.5, color='green', alpha=0.05, label='Authentic Range')
    
    # Summary Box
    results_box = (f"FINAL VERDICT: {verdict}\n"
                   f"------------------------\n"
                   f"Peak Suspicion: {peak_suspicion:.4f}\n"
                   f"Average Suspicion: {avg_suspicion:.4f}\n"
                   f"Model Confidence: {confidence*100:.1f}%")

    plt.text(0.02, 0.95, results_box, transform=plt.gca().transAxes, fontsize=12,
             verticalalignment='top', fontweight='bold',
             bbox=dict(boxstyle='round', facecolor='white', edgecolor='gray', alpha=0.9))

    plt.title(f"Forensic Analysis: {os.path.basename(video_path)}", fontsize=14)
    plt.xlabel("Time (Seconds)", fontsize=12)
    plt.ylabel("Suspicion Score (Fake Probability)", fontsize=12)
    plt.ylim(0, 1.1)
    plt.legend(loc='upper right')
    
    output_name = f"forensic_report_{os.path.basename(video_path)}.png"
    plt.savefig(output_name, dpi=300)
    print(f"Report Generated: {output_name}")
    plt.show()

if __name__ == "__main__":
    generate_suspicion_graph(VIDEO_TO_TEST)