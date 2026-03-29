<<<<<<< HEAD
# DeepShield AI - AI-Based Deepfake Detection Application

DeepShield AI is a full-stack, AI-based deepfake detection application designed to identify manipulated media and provide evidence-backed verification. By bridging an interactive, forensic-style React frontend with a powerful Python FastAPI backend, it allows users to upload videos and instantly verify their structural authenticity against neural manipulation.

At its core, the system utilizes state-of-the-art Vision Transformers (ViT) to exploit self-attention mechanisms, moving beyond simple pixel-level artifact detection to identify global structural inconsistencies and "structural lies" in high-resolution generated videos.

## 🚀 Core Features

### Machine Learning Engine (Backend)
* **Vision Transformer (ViT) Architecture:** Utilizes a ViT-Base backbone with 16x16 patch embeddings to transform spatial data into a sequence for the Transformer.
* **Automated Preprocessing Pipeline:** Extracts frames from videos and uses Mediapipe to detect and crop facial regions for standardized input.
* **High-Fidelity Detection:** Built to detect high-resolution diffusion signatures from advanced tools like Sora and Veo. Designed to train on datasets like FaceForensics++ and Celeb-DF.
* **FastAPI Integration:** Provides real-time prediction scores and frame-by-frame confidence metrics via a Python REST API backend.

### Forensic Dashboard (Frontend)
* **Interactive Cybersecurity Interface:** A sleek React web portal with glassmorphism design that guides users through the analysis process.
* **Live Telemetry Charting:** Generates an interactive frame-by-frame confidence graph (via Recharts) displaying exactly when the AI detects manipulation.
* **Client-Free Rendering:** Resolves DOM performance choke-points by consuming server-side generated Base64 JPEG frame thumbnails completely bypassing browser-side extraction delays and hardware decoder stalling.
* **Detailed Reporting:** Generates overall confidence scores and final verdicts in a beautiful, hacker-themed dashboard.

## 🏗️ System Design

The application follows a structured pipeline:
1. **Input:** User uploads an MP4, AVI, or MOV video file for analysis via the React frontend.
2. **Preprocessing Engine (Backend):** Extracts frames sequentially and uses Mediapipe (`blaze_face_short_range.tflite`) to detect and crop the face.
3. **ViT Encoder:** The facial data is broken into patches, projected linearly, and processed through self-attention layers using PyTorch.
4. **Classification Head:** A fully connected layer evaluates the patches and outputs a Real/Fake score for each sampled frame.
5. **Base64 Tying:** Original sample frames are localized, optimally compressed to 180x100 JPEGs, and encoded in Base64 strings directly to the JSON response block.
6. **Output:** The React dashboard renders the overall prediction score, confidence gauge, and an exact frame-by-frame telemetry graph with instant hover diagnosis.

## 🛠️ Technology Stack

**Frontend:**
* React.js (Create React App)
* Lucide React (Icons) & Recharts (Telemetry Graphing)
* Three.js (Hologram Visuals)
* Vanilla CSS (Custom Glassmorphism Theme)

**Backend & AI:**
* Python (FastAPI, Uvicorn)
* PyTorch & Torchvision (Vision Transformers)
* OpenCV & Mediapipe (Computer Vision & Face Detection)
* NumPy & Matplotlib (Data handling)

## ⚙️ Installation & Usage

### 1. Backend Setup
```bash
# Clone the repository and navigate to backend
git clone https://github.com/YOUR_USERNAME/DeepShield-AI.git
cd DeepShield-AI/backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies (CRITICAL: numpy<2 is required for PyTorch compatibility)
pip install -r requirements.txt
pip install "numpy<2"

# Ensure your model files are present in the backend folder:
# 1. fine_tuned_v4.pth
# 2. blaze_face_short_range.tflite

# Start the FastAPI server (running on port 8001 to prevent conflicts)
python -m uvicorn app:app --host 127.0.0.1 --port 8001
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start at `http://localhost:3000` and automatically connect to the backend at `http://127.0.0.1:8001`.

## 🚧 Future Scope

* **Multimodal Detection:** Integrating audio analysis to catch lip-sync and voice mismatches.
* **Temporal Transformers:** Using ViViT to ensure consistency across the entire video sequence.
* **Mobile Optimization:** Lightening the ViT model for real-time verification on smartphones.
* **Automated PDF Reporting:** Enhancing the system to include automated PDF/HTML reporting and metadata extraction.

## 🎓 Academic Context

This project (CSD 334 MINI PROJECT) was developed as an application-based project at **SCMS School of Engineering and Technology (SSET)**, Cochin, Department of Computer Science and Engineering.

**Development Team (Group 1):**
* Mr. Aadhithyan Sudheesh Kumar [SCM23CS001]
* Mr. Amishad Martin [SCM23CS043]
* Ms. Anaya Wilson [SCM23CS051]
* Ms. Aneeja J [SCM23CS053]

**Project Guide:**
* Ms. Bini Omman (Assistant Professor, Department of CSE)
=======
---
title: DeepShieldAI
emoji: 🦀
colorFrom: pink
colorTo: red
sdk: docker
pinned: false
license: mit
short_description: deepfake-detection-app
---

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference
>>>>>>> 873da357b11a475d996bcbdb13ac2fd541bd67b6
