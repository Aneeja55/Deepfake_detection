import os, sys, traceback

os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import types as _types, importlib.machinery as _machinery

def _make_tf_stub(name):
    mod = _types.ModuleType(name)
    mod.__spec__ = _machinery.ModuleSpec(name, None)
    mod.__version__ = "2.10.1"
    mod.__path__ = []
    return mod

for _n in ["tensorflow","tensorflow.python","tensorflow.python.framework",
           "tensorflow.python.framework.ops","tensorflow.python.eager",
           "tensorflow.python.eager.context","tensorflow.compat",
           "tensorflow.compat.v1","tensorflow.compat.v2","tensorflow.core","tensorflow.io"]:
    sys.modules[_n] = _make_tf_stub(_n)

steps = [
    ("cv2", lambda: __import__("cv2")),
    ("torch", lambda: __import__("torch")),
    ("torchvision", lambda: __import__("torchvision")),
    ("mediapipe", lambda: __import__("mediapipe")),
    ("mediapipe.tasks.python", lambda: __import__("mediapipe.tasks.python", fromlist=["python"])),
    ("mediapipe.tasks.python.vision", lambda: __import__("mediapipe.tasks.python.vision", fromlist=["vision"])),
    ("fastapi", lambda: __import__("fastapi")),
]

for name, fn in steps:
    try:
        fn()
        print(f"OK: {name}")
    except Exception as e:
        print(f"FAIL: {name} -> {e}")
        traceback.print_exc()

print("\n--- Loading ViT model ---")
try:
    import torch, torch.nn as nn
    from torchvision import models
    DEVICE = torch.device('cpu')
    model = models.vit_b_16(weights=None)
    model.heads.head = nn.Sequential(nn.Dropout(0.4), nn.Linear(model.heads.head.in_features, 1))
    model.load_state_dict(torch.load("fine_tuned_v4.pth", map_location=DEVICE))
    print("Model loaded OK")
except Exception as e:
    print(f"Model load FAIL: {e}")
    traceback.print_exc()

print("\n--- Loading face detector ---")
try:
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision
    base_options = python.BaseOptions(model_asset_path="blaze_face_short_range.tflite")
    detector = vision.FaceDetector.create_from_options(
        vision.FaceDetectorOptions(base_options=base_options)
    )
    print("Face detector loaded OK")
except Exception as e:
    print(f"Face detector FAIL: {e}")
    traceback.print_exc()

print("\nDone.")