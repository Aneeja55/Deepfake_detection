import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../ThemeContext";
import "../index.css";

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={styles.themeToggle}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          <div style={{
            ...styles.toggleTrack,
            backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          }}>
            <div style={{
              ...styles.toggleThumb,
              transform: isDark ? "translateX(2px)" : "translateX(24px)",
              backgroundColor: isDark ? "#1e293b" : "#fbbf24",
              boxShadow: isDark 
                ? "0 0 6px rgba(148, 163, 184, 0.3)" 
                : "0 0 8px rgba(251, 191, 36, 0.5)"
            }}>
              {isDark 
                ? <Moon size={12} color="#94a3b8" /> 
                : <Sun size={12} color="#92400e" />
              }
            </div>
          </div>
        </button>

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
    transition: "background-color 0.3s ease",
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
    gap: "20px",
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
  },
  themeToggle: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  toggleTrack: {
    width: "48px",
    height: "24px",
    borderRadius: "12px",
    position: "relative",
    transition: "background-color 0.3s ease",
    border: "1px solid var(--border-color)",
  },
  toggleThumb: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    position: "absolute",
    top: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
  }
};

export default Navbar;