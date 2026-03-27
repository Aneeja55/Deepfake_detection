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
          <div style={styles.socials}>
            <a href="https://github.com/Aneej" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.26c3.1-.3 6.3-1.5 6.3-7.23 0-1.6-.5-2.9-1.4-3.92.1-.4.6-2-1.4-4-2 0-3.3 1.3-3.3 1.3-1.2-.4-2.5-.4-3.8-.4s-2.6.4-3.8.4C4.3 2.1 3 3.6 3 3.6c-2 2-1.5 3.6-1.4 4-.9 1-1.4 2.3-1.4 3.92 0 5.7 3.2 6.9 6.3 7.23A4.8 4.8 0 0 0 8 18v4"></path>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12 3 10c1.3.6 2.7.7 4 .5-3.3-2-3-8-1-10 2.4 3 6.2 5 10.5 5.3C16 3 20 4 22 4z"></path>
              </svg>
            </a>
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
    justifyContent: "space-between",
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
