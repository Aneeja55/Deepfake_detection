import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../index.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="glass-panel" style={styles.nav}>
      <div style={styles.logoContainer}>
        {/* Simple SVG Logo */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
        <h2 style={styles.logoText}>DeepShield<span style={styles.accent}>AI</span></h2>
      </div>

      <div style={styles.links}>
        <Link 
          to="/" 
          style={{...styles.link, color: location.pathname === "/" ? "var(--text-main)" : "var(--text-muted)"}}
        >
          Dashboard
        </Link>
        <Link 
          to="/detect" 
          style={{...styles.link, ...styles.primaryBtn}}
        >
          Detect Video
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 5%",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderRadius: "0 0 16px 16px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logoText: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },
  accent: {
    color: "var(--primary-blue)"
  },
  links: {
    display: "flex",
    gap: "24px",
    alignItems: "center"
  },
  link: {
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.95rem",
    transition: "color 0.2s"
  },
  primaryBtn: {
    backgroundColor: "var(--primary-blue)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "background-color 0.2s",
  }
};

export default Navbar;