import React from "react";

export function Screen({ children, style = {}, className = "" }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 20px",
      animation: "fadeIn 0.5s ease forwards", position: "relative", ...style,
    }} className={className}>
      {children}
    </div>
  );
}

export function Divider() {
  return (
    <div style={{
      width: "100%", maxWidth: 300, height: 1,
      background: "linear-gradient(90deg, transparent, var(--accent-gold), transparent)",
      margin: "20px auto",
    }} />
  );
}

export function Btn({ children, onClick, variant = "primary", disabled = false, style = {} }) {
  const variants = {
    primary: { background: "linear-gradient(135deg, #c9952a, #d4a017)", color: "#0a0a0f", border: "none" },
    danger:  { background: "transparent", color: "#e63946", border: "1.5px solid #e63946" },
    ghost:   { background: "transparent", color: "var(--text-muted)", border: "1.5px solid rgba(255,255,255,0.1)" },
  };

  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        padding: "14px 32px", borderRadius: 4, fontSize: "1rem",
        fontFamily: "'Cinzel Decorative', serif", fontWeight: 700, letterSpacing: "0.05em",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s ease", width: "100%", maxWidth: 340,
        ...variants[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "24px", width: "100%", maxWidth: 420, ...style,
    }}>
      {children}
    </div>
  );
}

export function NarratorText({ text, subtext }) {
  return (
    <div style={{ textAlign: "center", padding: "0 16px", animation: "fadeIn 0.8s ease forwards" }}>
      <p style={{
        fontSize: "clamp(1.4rem, 5vw, 2rem)", fontFamily: "'Crimson Pro', serif",
        fontStyle: "italic", lineHeight: 1.5, color: "var(--text-primary)",
        whiteSpace: "pre-line", marginBottom: subtext ? 16 : 0,
      }}>
        {text}
      </p>
      {subtext && <p style={{ color: "var(--text-muted)", fontSize: "1rem", fontStyle: "italic" }}>{subtext}</p>}
    </div>
  );
}