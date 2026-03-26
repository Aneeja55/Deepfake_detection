# [cite_start]DeepShield AI - AI-Based Deepfake Detection Application [cite: 7, 58]

[cite_start]DeepShield AI is a full-stack, AI-based deepfake detection application designed to identify manipulated media and provide evidence-backed verification[cite: 21]. [cite_start]By bridging an interactive, forensic-style React frontend [cite: 40] [cite_start]with a powerful Python backend[cite: 42], it allows users to upload videos and instantly verify their structural authenticity against neural manipulation.

[cite_start]At its core, the system utilizes state-of-the-art Vision Transformers (ViT) [cite: 43] [cite_start]to exploit self-attention mechanisms [cite: 80][cite_start], moving beyond simple pixel-level artifact detection to identify global structural inconsistencies and "structural lies" in high-resolution generated videos[cite: 80, 85].

## 🚀 Core Features

### Machine Learning Engine (Backend)
* [cite_start]**Vision Transformer (ViT) Architecture:** Utilizes a ViT-Base backbone [cite: 138, 151] [cite_start]with 16x16 patch embeddings to transform spatial data into a sequence for the Transformer[cite: 137].
* [cite_start]**Automated Preprocessing Pipeline:** Extracts frames from videos and uses MTCNN/Mediapipe to detect and crop facial regions for standardized input[cite: 44, 136].
* [cite_start]**High-Fidelity Detection:** Built to detect high-resolution diffusion signatures from advanced tools like Sora and Veo[cite: 79, 149]. [cite_start]Designed to train on datasets like FaceForensics++ and Celeb-DF[cite: 86, 135].
* [cite_start]**FastAPI/Flask Integration:** Provides prediction scores via Python backend endpoints[cite: 42].

### Forensic Dashboard (Frontend)
* [cite_start]**Interactive Cybersecurity Interface:** A sleek React web portal [cite: 35, 40] that guides users through the analysis process.
* [cite_start]**Explainable AI (XAI):** Generates heatmaps to show exactly which facial patches drove the "fake" decision[cite: 148].
* [cite_start]**Detailed Reporting:** Generates confidence scores and highlights suspicious frames using timeline analysis[cite: 24].

## 🏗️ System Design

The application follows a structured pipeline:
1. [cite_start]**Input:** User uploads a video or image file for analysis[cite: 144].
2. [cite_start]**Preprocessing Engine:** Extracts frames and detects/crops the face[cite: 142].
3. [cite_start]**ViT Encoder:** The facial data is broken into patches, projected linearly, and processed through self-attention layers[cite: 142].
4. [cite_start]**Classification Head:** A fully connected layer outputs a Real/Fake score[cite: 142].
5. [cite_start]**Output:** The React dashboard renders the prediction score and XAI explanation heatmap[cite: 144].

## 🛠️ Technology Stack

**Frontend:**
* [cite_start]React [cite: 40]
* HTML/CSS (Custom Glassmorphism & Enterprise UI)

**Backend & AI:**
* [cite_start]Python (FastAPI / Flask) [cite: 42]
* [cite_start]PyTorch (Vision Transformers) [cite: 43]
* [cite_start]OpenCV, Mediapipe, FFmpeg (Computer Vision & Processing) [cite: 44]
* [cite_start]NumPy, Pandas, Scikit-learn (Data handling and metrics) [cite: 47]

## ⚙️ Installation & Usage

### 1. Backend Setup
\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/DeepShield-AI.git
cd DeepShield-AI/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install torch torchvision torchaudio opencv-python mediapipe timm fastapi uvicorn

# Ensure your trained model weights (vit_deepfake_model.pth) are placed in the correct directory
# Start the FastAPI server
uvicorn main:app --reload
\`\`\`

### 2. Frontend Setup
\`\`\`bash
# Open a new terminal and navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the React development server
npm start
\`\`\`

## 🚧 Future Scope

* [cite_start]**Multimodal Detection:** Integrating audio analysis to catch lip-sync and voice mismatches[cite: 162].
* [cite_start]**Temporal Transformers:** Using ViViT to ensure consistency across the entire video sequence[cite: 163].
* [cite_start]**Mobile Optimization:** Lightening the ViT model for real-time verification on smartphones[cite: 165].
* [cite_start]**Automated PDF Reporting:** Enhancing the system to include automated PDF/HTML reporting and metadata extraction [cite: 26] [cite_start]using tools like ReportLab or WeasyPrint[cite: 45].

## 🎓 Academic Context

[cite_start]This project (CSD 334 MINI PROJECT) [cite: 6] [cite_start]was developed as an application-based project [cite: 30] [cite_start]at **SCMS School of Engineering and Technology (SSET)**, Cochin, Department of Computer Science and Engineering[cite: 4, 56, 57].

[cite_start]**Development Team (Group 1):** [cite: 8]
* [cite_start]Mr. Aadhithyan Sudheesh Kumar [SCM23CS001] [cite: 9, 62]
* [cite_start]Mr. Amishad Martin [SCM23CS043] [cite: 10, 63]
* [cite_start]Ms. Aneeja J [SCM23CS053] [cite: 11, 64]
* [cite_start]Ms. Anaya Wilson [SCM23CS051] [cite: 12, 65]

**Project Guide:**
* [cite_start]Ms. Bini Omman (Assistant Professor, Department of CSE) [cite: 55, 60]