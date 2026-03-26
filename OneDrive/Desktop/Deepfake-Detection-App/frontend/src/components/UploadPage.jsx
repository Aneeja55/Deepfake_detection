import React, { useState, useRef, useEffect } from "react";
import ResultPage from "./ResultPage";
import FaceHologramScene from "./FaceHologram";
import { UploadCloud, FileVideo, X, AlertCircle } from "lucide-react";
import { analyzeVideo } from "../api";

const loadingMessages = [
  "Initializing ViT Spatial Analyzer...",
  "Extracting biometric landmarks...",
  "Scanning for diffusion artifacts...",
  "Analyzing temporal consistency...",
  "Compiling confidence matrix..."
];

function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState(null);
  
  // 👉 NEW: Error state for bulletproof validation
  const [error, setError] = useState(null); 
  const fileInputRef = useRef(null);

  // Auto-dismiss the error toast after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Terminal Readout Effect
  useEffect(() => {
    let interval;
    if (loading) {
      let step = 0;
      setLoadingText(loadingMessages[0]);
      interval = setInterval(() => {
        step++;
        if (step < loadingMessages.length) {
          setLoadingText(loadingMessages[step]);
        }
      }, 700); 
    }
    return () => clearInterval(interval);
  }, [loading]);

  // 👉 NEW: Master Validation Function
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    // 1. Check File Type (MP4, AVI, MOV)
    const validTypes = ["video/mp4", "video/avi", "video/quicktime", "video/x-msvideo", "video/x-m4v"];
    const isValidExtension = selectedFile.name.match(/\.(mp4|avi|mov)$/i);
    
    if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
      setError("Invalid format. Please upload an MP4, AVI, or MOV video file.");
      return;
    }

    // 2. Check File Size (Max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (selectedFile.size > maxSize) {
      setError(`File is too large (${(selectedFile.size / (1024*1024)).toFixed(1)}MB). Maximum allowed size is 50MB.`);
      return;
    }

    // If it passes both checks, clear errors and set the file!
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await analyzeVideo(formData);
      const data = response.data;

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        avg_suspicion: data.avg_suspicion,
        peak_suspicion: data.peak_suspicion,
        frame_data: data.frame_data,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Analysis failed. Please ensure the backend server is running and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  if (result) return <ResultPage result={result} reset={handleReset} />;

  // Determine the dropzone border color based on state
  let dropzoneColor = "var(--border-color)";
  if (error) dropzoneColor = "var(--danger)";
  else if (dragActive) dropzoneColor = "var(--accent-cyan)";

  return (
    <div style={styles.container}>
      
      {/* 👉 NEW: Absolute positioned Error Toast Notification */}
      {error && (
        <div style={styles.errorToast}>
          <AlertCircle size={20} color="var(--danger)" />
          <span>{error}</span>
        </div>
      )}

      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Secure Verification</h1>
          <p style={styles.subtitle}>Upload your video file for ViT spatial analysis.</p>
        </div>

        <FaceHologramScene isAnalyzing={loading} />

        <div
          style={{
            ...styles.dropZone,
            borderColor: dropzoneColor,
            backgroundColor: error ? "rgba(239, 68, 68, 0.05)" : (dragActive ? "rgba(6, 182, 212, 0.05)" : "rgba(0,0,0,0.2)")
          }}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0]); // Send to validator
            }
          }}
          onClick={() => !file && fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="video/mp4,video/x-m4v,video/avi,video/quicktime"
            onChange={(e) => processFile(e.target.files[0])} // Send to validator
            style={{ display: "none" }}
            ref={fileInputRef}
          />

          {file ? (
            <div style={styles.fileChip}>
              <div style={styles.fileChipLeft}>
                <FileVideo size={24} color="var(--primary-blue)" />
                <div style={styles.fileInfo}>
                  <strong className="truncate" style={{color: "var(--text-main)", fontSize: "0.9rem", display: "block", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{file.name}</strong>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                style={styles.clearBtn}
                disabled={loading} 
              >
                <X size={18} color={loading ? "var(--border-color)" : "var(--text-muted)"} />
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={40} color={error ? "var(--danger)" : (dragActive ? "var(--accent-cyan)" : "var(--text-muted)")} style={{marginBottom: "12px"}} />
              <p style={{ fontWeight: "500", color: error ? "var(--danger)" : "var(--text-main)", marginBottom: "4px" }}>
                {error ? "Upload Blocked" : "Drag & drop a video file"}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                MP4, AVI, or MOV (Max 50MB)
              </p>
            </>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
          disabled={!file || loading}
          style={{
            ...styles.button,
            opacity: (!file || loading) ? 0.6 : 1,
            cursor: (!file || loading) ? "not-allowed" : "pointer",
            boxShadow: (!file || loading) ? "none" : "0 4px 14px 0 rgba(59, 130, 246, 0.39)"
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span className="spinner"></span> 
              <span style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>{loadingText}</span>
            </div>
          ) : (
            "Run Deepfake Analysis"
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "calc(100vh - 80px)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", position: "relative" },
  card: { padding: "40px", width: "100%", maxWidth: "550px", textAlign: "center", marginTop: "40px" },
  header: { marginBottom: "10px" },
  title: { fontSize: "1.75rem", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" },
  subtitle: { color: "var(--text-muted)", fontSize: "0.95rem" },
  dropZone: { border: "2px dashed", borderRadius: "12px", padding: "20px", marginBottom: "24px", transition: "all 0.3s ease", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "140px" },
  fileChip: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", backgroundColor: "rgba(255,255,255,0.05)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border-color)" },
  fileChipLeft: { display: "flex", alignItems: "center", gap: "12px", textAlign: "left" },
  clearBtn: { background: "transparent", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.2s" },
  button: { width: "100%", padding: "16px", backgroundColor: "var(--primary-blue)", border: "none", borderRadius: "10px", color: "white", fontWeight: "600", fontSize: "1rem", transition: "all 0.2s ease", minHeight: "56px" },
  
  // New Toast Style
  errorToast: { position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "12px", backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid var(--danger)", backdropFilter: "blur(12px)", color: "var(--text-main)", padding: "14px 24px", borderRadius: "10px", boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)", zIndex: 50, fontWeight: "500", fontSize: "0.95rem", animation: "slideDown 0.3s ease-out forwards" }
};

export default UploadPage;