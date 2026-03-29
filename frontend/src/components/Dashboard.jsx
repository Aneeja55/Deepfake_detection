import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, Lock, ScanEye, ChevronDown, UploadCloud, Cpu, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";
import "../index.css";

// --- FAQ Item Component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.faqItem} onClick={() => setIsOpen(!isOpen)}>
      <div style={styles.faqQuestion}>
        <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "600" }}>{question}</h4>
        <ChevronDown
          size={20}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            color: "var(--primary-blue)"
          }}
        />
      </div>
      {isOpen && (
        <div style={styles.faqAnswer}>
          <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: "1.6" }}>{answer}</p>
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---
function Dashboard() {
  return (
    <div style={styles.container}>

      {/* 1. HERO SECTION */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Expose the <span style={styles.gradientText}>Fabricated Reality</span>
        </h1>
        <p style={styles.heroSubtitle}>
          An experimental deepfake detection framework powered by Vision Transformers. Currently undergoing active development and testing. Results may contain inaccuracies.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <Link to="/detect" style={styles.ctaButton}>Try Beta Analysis</Link>
        </div>
      </div>

      {/* 2. VIDEO COMPARISON DEMO SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Real vs. Synthetic Media</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "30px", textAlign: "center", maxWidth: "600px", fontSize: "1.1rem" }}>
          Our models are actively being trained against modern GANs and diffusion model outputs. The current accuracy of structural detection on wild media is still strictly experimental.
        </p>

        <div style={styles.videoGrid}>
          {/* Fake Video Player */}
          <div className="glass-panel" style={{ ...styles.videoWrapper, borderTop: "4px solid var(--danger)" }}>
            <div style={{ ...styles.videoHeader, color: "var(--danger)", backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
              <AlertTriangle size={18} />
              <span style={{ fontWeight: "700", letterSpacing: "1px" }}>SYNTHETIC MEDIA</span>
            </div>
            <video
              autoPlay loop muted playsInline
              style={styles.videoPlayer}
              poster="https://via.placeholder.com/600x400/070B14/3b82f6?text=Loading+Fake+Demo"
            >
              {/* FIXED TYPO HERE: Changed "og.mp4" to "video/mp4" */}
              <source src="/df1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Real Video Player */}
          <div className="glass-panel" style={{ ...styles.videoWrapper, borderTop: "4px solid var(--success)" }}>
            <div style={{ ...styles.videoHeader, color: "var(--success)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
              <CheckCircle size={18} />
              <span style={{ fontWeight: "700", letterSpacing: "1px" }}>ORIGINAL SOURCE</span>
            </div>
            <video
              autoPlay loop muted playsInline
              style={styles.videoPlayer}
              poster="https://via.placeholder.com/600x400/070B14/10b981?text=Loading+Real+Demo"
            >
              <source src="/og.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* 3. HOW IT WORKS SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How to Use DeepShieldAI</h2>
        <div className="steps-grid-container">
          <div className="step-card-item" style={styles.stepCard}>
            <div style={styles.stepIcon}><UploadCloud size={28} /></div>
            <h3 style={styles.stepTitle}>1. Upload Media</h3>
            <p style={styles.stepText}>Drop your video file into our secure portal. We support MP4, AVI, and MOV formats with zero sign-up required.</p>
          </div>
          <div className="step-card-item" style={styles.stepCard}>
            <div style={styles.stepIcon}><Cpu size={28} /></div>
            <h3 style={styles.stepTitle}>2. ViT Analysis</h3>
            <p style={styles.stepText}>Our proprietary Vision Transformers scan frame-by-frame, detecting spatial anomalies and temporal inconsistencies.</p>
          </div>
          <div className="step-card-item" style={styles.stepCard}>
            <div style={styles.stepIcon}><FileCheck size={28} /></div>
            <h3 style={styles.stepTitle}>3. Forensic Report</h3>
            <p style={styles.stepText}>Get instant, irrefutable results. View a detailed breakdown of confidence scores and specific manipulation artifacts.</p>
          </div>
        </div>
      </div>

      {/* 4. TRUST & FEATURES GRID */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Research Objectives</h2>
        <div className="features-grid-container">
          <div className="glass-panel" style={styles.card}>
            <div style={styles.iconWrapper}><Zap size={32} color="var(--accent-cyan)" /></div>
            <h3 style={styles.cardTitle}>Inference Optimization</h3>
            <p style={styles.cardText}>We are continually optimizing our neural network to quickly process complex video spatial data directly within standard development environments.</p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={styles.iconWrapper}><ScanEye size={32} color="var(--primary-blue)" /></div>
            <h3 style={styles.cardTitle}>Spatial Analysis</h3>
            <p style={styles.cardText}>Exploring ViT technology to identify microscopic pixel-level manipulation, with ongoing efforts to constantly reduce false-positive rates.</p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={styles.iconWrapper}><Shield size={32} color="var(--danger)" /></div>
            <h3 style={styles.cardTitle}>Iterative Defense</h3>
            <p style={styles.cardText}>As generative AI rapidly evolves, so does our dataset. The core detection engine routinely undergoes rigorous retraining against the latest synthetic anomalies.</p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={styles.iconWrapper}><Lock size={32} color="var(--success)" /></div>
            <h3 style={styles.cardTitle}>Data Privacy</h3>
            <p style={styles.cardText}>A fundamental principle of our architecture. Experimental uploads are processed strictly in a volatile state and completely purged after analysis.</p>
          </div>
        </div>
      </div>

      {/* 5. FAQ SECTION */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqContainer}>
          <FAQItem
            question="What is deepfake detection?"
            answer="Deepfake detection is the process of using artificial intelligence to analyze media (video, audio, or images) to determine if it has been synthetically generated or altered by neural networks."
          />
          <FAQItem
            question="How does DeepShieldAI's technology work?"
            answer="We utilize Vision Transformers (ViT), a state-of-the-art AI architecture. Instead of just looking at the whole image, ViTs break frames down into patches and analyze the structural relationships between them, spotting the tiny blending errors left by deepfake generators."
          />
          <FAQItem
            question="Are my uploaded videos saved on your servers?"
            answer="No. All files are temporarily held in memory strictly for the duration of the analysis. Once the forensic report is generated, the file is permanently purged. We respect your privacy and do not use user uploads to train our models."
          />
          <FAQItem
            question="What file formats are supported?"
            answer="Currently, our ViT engine supports standard video formats including MP4, AVI, and MOV, up to a maximum file size of 50MB per scan."
          />
        </div>
      </div>

    </div>
  );
}

// --- Styles ---
const styles = {
  container: { padding: "60px 5% 100px", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" },

  // Hero
  hero: { textAlign: "center", marginBottom: "80px", maxWidth: "800px", paddingTop: "40px" },
  betaBadge: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", backgroundColor: "rgba(56, 189, 248, 0.1)", color: "var(--accent-cyan)", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "1px", marginBottom: "20px", border: "1px solid rgba(56, 189, 248, 0.2)" },
  heroTitle: { fontSize: "4rem", fontWeight: "800", lineHeight: "1.1", marginBottom: "20px", letterSpacing: "-1.5px" },
  gradientText: { background: "linear-gradient(135deg, var(--accent-cyan), var(--primary-blue))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSubtitle: { fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "40px", lineHeight: "1.6" },
  ctaButton: { display: "inline-block", backgroundColor: "var(--primary-blue)", color: "white", padding: "18px 36px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "1.1rem", boxShadow: "0 4px 20px 0 rgba(59, 130, 246, 0.4)", transition: "all 0.2s ease" },

  // Video Demo Section
  videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", width: "100%", maxWidth: "1000px" },
  videoWrapper: { overflow: "hidden", display: "flex", flexDirection: "column" },
  videoHeader: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", fontSize: "0.9rem" },
  videoPlayer: { width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" },

  // Sections
  section: { width: "100%", marginBottom: "120px", display: "flex", flexDirection: "column", alignItems: "center" },
  sectionTitle: { fontSize: "2.5rem", fontWeight: "800", marginBottom: "40px", textAlign: "center", letterSpacing: "-0.5px" },

  // Steps Grid
  stepCard: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px" },
  stepIcon: { width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "var(--primary-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" },
  stepTitle: { fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px" },
  stepText: { color: "var(--text-muted)", lineHeight: "1.6" },

  // Feature Grid
  card: { padding: "30px", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default" },
  iconWrapper: { marginBottom: "20px", display: "inline-block", padding: "12px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" },
  cardTitle: { fontSize: "1.25rem", marginBottom: "12px", fontWeight: "700" },
  cardText: { color: "var(--text-muted)", lineHeight: "1.6", fontSize: "0.95rem" },

  // FAQ Accordion
  faqContainer: { width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "16px" },
  faqItem: { backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "20px 24px", cursor: "pointer", transition: "background-color 0.2s ease" },
  faqQuestion: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  faqAnswer: { marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }
};

export default Dashboard;