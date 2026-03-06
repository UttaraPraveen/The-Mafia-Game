import React, { useRef, useEffect, useState } from "react";

// ✨ PARTICLE CANVAS
export function ParticleCanvas({ mode = "embers" }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    function spawn(initial = false) {
      const isBlood = mode === "blood";
      return {
        x: Math.random() * canvas.width,
        y: initial ? Math.random() * canvas.height : (isBlood ? -10 : canvas.height + 10),
        vx: (Math.random() - 0.5) * 0.4,
        vy: isBlood ? Math.random() * 1 + 0.3 : -(Math.random() * 0.7 + 0.2),
        size: Math.random() * (isBlood ? 3.5 : 2) + 0.8,
        alpha: Math.random() * 0.6 + 0.1,
        life: Math.random(),
        speed: Math.random() * 0.004 + 0.001,
        color: isBlood
          ? `hsl(${352 + Math.random() * 12}, 85%, ${25 + Math.random() * 25}%)`
          : `hsl(${28 + Math.random() * 18}, ${55 + Math.random() * 35}%, ${48 + Math.random() * 35}%)`,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: (Math.random() - 0.5) * 0.025,
      };
    }

    const count = mode === "blood" ? 45 : 65;
    particles = Array.from({ length: count }, () => spawn(true));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.35;
        p.y += p.vy;
        p.life += p.speed;
        const fade = Math.sin(p.life * Math.PI);
        ctx.globalAlpha = p.alpha * fade;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * Math.max(0.1, fade), 0, Math.PI * 2);
        ctx.fill();
        const gone = mode === "blood" ? p.y > canvas.height + 20 : p.y < -20;
        if (gone || p.life >= 1) particles[i] = spawn();
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [mode]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// 🌑 AMBIENT ORB
export function AmbientOrb({ color, x, y, size = 300, delay = 0 }) {
  return (
    <div style={{
      position: "fixed",
      left: `${x}%`, top: `${y}%`,
      width: size, height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}1e 0%, transparent 70%)`,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      animation: `orbDrift ${12 + delay * 2}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      filter: "blur(40px)",
      zIndex: 0,
    }} />
  );
}

// ⏱️ COUNTDOWN RING
export function CountdownRing({ seconds, onComplete, color = "#e63946", size = 220, autoStart = true }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [key, setKey] = useState(0);
  const total = seconds;
  const r = (size / 2) - 16;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!autoStart) return;
    if (timeLeft <= 0) { setTimeout(() => onComplete?.(), 400); return; }
    const t = setTimeout(() => { setTimeLeft(s => s - 1); setKey(k => k + 1); }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, autoStart]);

  const offset = circ * (timeLeft / total);
  const urgent = timeLeft <= 2;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={urgent ? "#e63946" : color} strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.95s linear, stroke 0.3s", filter: `drop-shadow(0 0 10px ${urgent ? "#e63946" : color})` }}
        />
      </svg>
      <div key={key} style={{
        fontSize: size * 0.3,
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        color: urgent ? "#e63946" : color,
        animation: "countPulse 0.95s ease forwards",
        textShadow: `0 0 24px ${urgent ? "#e63946" : color}`,
        lineHeight: 1,
      }}>
        {timeLeft}
      </div>
    </div>
  );
}

// 📜 GAME LOG MODAL
export function GameLogModal({ isOpen, onClose, eventLogs = [] }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", animation: "fadeUp 0.3s ease forwards" }}>
      <div className="glass-card" style={{ width: "90%", maxWidth: 400, padding: 24, position: "relative", maxHeight: "80vh", overflowY: "auto", border: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", color: "var(--mist)", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
        <h2 className="playfair gold-text" style={{ fontSize: "1.5rem", marginBottom: 20, textAlign: "center" }}>Game Log / Graveyard</h2>
        {eventLogs.length === 0 ? (
          <p style={{ color: "var(--mist)", textAlign: "center", fontStyle: "italic", margin: "40px 0" }}>No one has perished yet...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {eventLogs.map((log, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <div style={{ color: "var(--blood)", fontSize: "0.9rem", fontWeight: "bold", marginBottom: 4 }}>{log.name}</div>
                  <div style={{ color: "var(--mist)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 6 }}>
                    {log.role}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>ROUND {log.round}</div>
                  <div style={{ color: "var(--ghost)", fontSize: "0.65rem", letterSpacing: "0.05em" }}>{log.phase}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}