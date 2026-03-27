import React, { useState, useEffect } from "react";
// Swapped ActivitySquare for LineChart to ensure it renders correctly
import { AlertTriangle, CheckCircle, RotateCcw, Activity, Scan, Fingerprint, LineChart } from "lucide-react"; 
import TelemetryModal from "./TelemetryModal";
import "../index.css";

function ResultPage({ result, reset, file }) {
  const isFake = result.prediction.toUpperCase() === "FAKE";
  const targetConfidence = result.confidence * 100;
  
  const [displayScore, setDisplayScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the new graph modal

  // Animates the confidence score counting up
  useEffect(() => {
    let start = 0;
    const duration = 1000; 
    const increment = targetConfidence / (duration / 16); 
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetConfidence) {
        setDisplayScore(targetConfidence);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [targetConfidence]);

  // Premium SVG Radial Gauge Math
  const radius = 95; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const themeColor = isFake ? "var(--danger)" : "var(--success)";
  const glowShadow = isFake ? "drop-shadow(0 0 12px rgba(239, 68, 68, 0.4))" : "drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))";

  return (
    <div style={styles.container}>
      <div 
        className="glass-panel" 
        style={{
          ...styles.card, 
          borderTop: `4px solid ${themeColor}`,
          boxShadow: isFake ? "0 10px 40px -10px rgba(239, 68, 68, 0.15)" : "0 10px 40px -10px rgba(16, 185, 129, 0.15)"
        }}
      >
        
        {/* Header Section */}
        <div style={styles.header}>
          <div style={{...styles.iconRing, borderColor: themeColor, color: themeColor }}>
            {isFake ? <AlertTriangle size={36} /> : <CheckCircle size={36} />}
          </div>
          <h2 style={styles.title}>Forensic Report</h2>
          <span style={{...styles.badge, backgroundColor: isFake ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)", color: themeColor}}>
            {isFake ? "THREAT DETECTED" : "VERIFIED AUTHENTIC"}
          </span>
        </div>

        {/* Main Verdict & Enlarged Glowing Gauge */}
        <div style={styles.mainVerdict}>
          <div style={styles.gaugeContainer}>
            <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="120" cy="120" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle 
                cx="120" cy="120" r={radius} 
                fill="none" 
                stroke={themeColor} 
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ 
                  transition: "stroke-dashoffset 0.1s linear",
                  filter: glowShadow
                }}
              />
            </svg>
            <div style={styles.gaugeText}>
              <span style={styles.scoreNumber}>{displayScore.toFixed(1)}%</span>
              <span style={styles.scoreLabel}>{isFake ? "Fake Confidence" : "Real Confidence"}</span>
            </div>
          </div>
        </div>

        {/* ViT Telemetry Data Grid */}
        <div style={styles.telemetryGrid}>
          <div style={styles.telemetryItem}>
            <Scan size={18} color="var(--text-muted)" />
            <div style={styles.telemetryText}>
              <span style={styles.tLabel}>Spatial Artifacts</span>
              <span style={{...styles.tValue, color: isFake ? "var(--danger)" : "var(--text-main)"}}>
                {isFake ? "Anomalous" : "Standard"}
              </span>
            </div>
          </div>
          <div style={styles.telemetryItem}>
            <Activity size={18} color="var(--text-muted)" />
            <div style={styles.telemetryText}>
              <span style={styles.tLabel}>Temporal Consistency</span>
              <span style={{...styles.tValue, color: isFake ? "var(--danger)" : "var(--text-main)"}}>
                {isFake ? "Irregular" : "Stable"}
              </span>
            </div>
          </div>
          <div style={{...styles.telemetryItem, borderBottom: "none", paddingBottom: 0}}>
            <Fingerprint size={18} color="var(--text-muted)" />
            <div style={styles.telemetryText}>
              <span style={styles.tLabel}>Model Architecture</span>
              <span style={styles.tValue}>ViT-Base/16</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonContainer}>
          <button 
            style={{...styles.actionBtn, backgroundColor: "var(--primary-blue)", color: "white", border: "none"}} 
            onClick={() => setIsModalOpen(true)}
          >
            <LineChart size={18} />
            View Frame-by-Frame Telemetry
          </button>

          <button style={styles.resetBtn} onClick={reset}>
            <RotateCcw size={18} />
            Scan Another File
          </button>
        </div>

      </div>

      {/* The Interactive Chart Modal */}
      <TelemetryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} frameData={result.frame_data} prediction={result.prediction} file={file} />

    </div>
  );
}

const styles = {
  // Changed alignItems to 'flex-start' so it doesn't clip off the screen, allowing scrolling!
  container: { minHeight: "calc(100vh - 80px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "60px 20px" },
  
  // Tightened padding and reduced the gap from 36px to 24px to pull the buttons up
  card: { padding: "30px 40px", width: "100%", maxWidth: "550px", textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", margin: "0 auto" },
  
  header: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  iconRing: { width: "64px", height: "64px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--dropzone-bg)" },
  title: { fontSize: "1.75rem", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" },
  badge: { padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "1px" },
  mainVerdict: { display: "flex", justifyContent: "center", margin: "10px 0" },
  gaugeContainer: { position: "relative", width: "240px", height: "240px", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" },
  gaugeText: { position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  scoreNumber: { fontSize: "2.4rem", fontWeight: "800", color: "var(--text-main)", lineHeight: "1", textShadow: "0 2px 10px rgba(0,0,0,0.5)" },
  scoreLabel: { fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" },
  telemetryGrid: { display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border-color)" },
  telemetryItem: { display: "flex", alignItems: "center", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  telemetryText: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" },
  tLabel: { fontSize: "0.95rem", color: "var(--text-muted)", fontFamily: "monospace" },
  tValue: { fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)" },
  buttonContainer: { display: "flex", flexDirection: "column", gap: "12px" },
  actionBtn: { width: "100%", padding: "16px", borderRadius: "12px", fontWeight: "600", fontSize: "1rem", cursor: "pointer", transition: "all 0.2s ease", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)" },
  resetBtn: { width: "100%", padding: "16px", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", borderRadius: "12px", color: "var(--text-main)", fontWeight: "600", fontSize: "1rem", cursor: "pointer", transition: "all 0.2s ease", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }
};

export default ResultPage;