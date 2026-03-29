import React from "react";
import { Shield } from "lucide-react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Shield size={20} color="var(--primary-blue)" />
          <span style={styles.logoText}>DeepShield<span style={styles.accent}>AI</span></span>
        </div>
        <p style={styles.tagline}>Advanced ViT-based structural video forensics and deepfake detection.</p>
        
        <div style={styles.linksContainer}>
          <div style={styles.linkGroup}>
            <span style={styles.copy}>&copy; {new Date().getFullYear()} DeepShieldAI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "var(--bg-card)",
    borderTop: "1px solid var(--border-color)",
    padding: "40px 5% 20px 5%",
    marginTop: "auto", 
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.05)"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
    textAlign: "center"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "var(--text-main)",
    letterSpacing: "-0.5px"
  },
  accent: {
    color: "var(--primary-blue)"
  },
  tagline: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    maxWidth: "400px"
  },
  linksContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(128,128,128,0.1)",
    flexWrap: "wrap",
    gap: "16px"
  },
  copy: {
    fontSize: "0.85rem",
    color: "var(--text-muted)"
  },
  socials: {
    display: "flex",
    gap: "16px"
  },
  iconLink: {
    color: "var(--text-muted)",
    transition: "color 0.2s ease"
  }
};

export default Footer;
