import React, { useState, useEffect } from "react";
import { ROLES, NARRATOR } from "../utils/constants";
import { ParticleCanvas, AmbientOrb, CountdownRing, GameLogModal } from "./UI";

// 🏠 SETUP SCREEN
export function SetupScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(6);
  const [mafiaCount, setMafiaCount] = useState(1);
  const [hasDoctor, setHasDoctor] = useState(true);
  const [hasDetective, setHasDetective] = useState(true);
  const [playerNames, setPlayerNames] = useState([]);
  const [step, setStep] = useState("config");

  useEffect(() => {
    setPlayerNames(Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`));
  }, [playerCount]);

  const specials = (hasDoctor ? 1 : 0) + (hasDetective ? 1 : 0);
  const villagerCount = playerCount - mafiaCount - specials;
  const isValid = villagerCount >= 1 && mafiaCount >= 1;

  function handleStart() {
    onStart(playerNames, { mafia: mafiaCount, doctor: hasDoctor ? 1 : 0, detective: hasDetective ? 1 : 0 });
  }

  if (step === "names") {
    const trimmedNames = playerNames.map(n => n.trim().toLowerCase());
    const hasEmptyName = trimmedNames.some(n => !n);
    const hasDuplicates = new Set(trimmedNames).size !== trimmedNames.length;
    const namesValid = !hasEmptyName && !hasDuplicates;

    return (
      <div className="screen">
        <ParticleCanvas mode="embers" />
        <AmbientOrb color="#c9a84c" x={20} y={20} size={400} delay={0} />
        <AmbientOrb color="#e63946" x={80} y={70} size={300} delay={4} />
        <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease forwards" }}>
          <h2 className="playfair gold-text" style={{ fontSize: "1.3rem", textAlign: "center", marginBottom: 6 }}>
            Who Walks These Streets?
          </h2>
          <p style={{ color: "var(--mist)", textAlign: "center", fontSize: "0.7rem", letterSpacing: "0.25em", marginBottom: 28 }}>ENTER PLAYER NAMES</p>
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {playerNames.map((name, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, animation: `fadeUp ${0.2 + i * 0.04}s ease both`, opacity: 0, animationFillMode: "forwards" }}>
                  <span style={{ color: "var(--blood)", fontFamily: "'Playfair Display',serif", width: 22, textAlign: "right", fontSize: "0.9rem" }}>{i + 1}</span>
                  <input className="input" value={name} onChange={e => { const u = [...playerNames]; u[i] = e.target.value; setPlayerNames(u); }} placeholder={`Player ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {hasDuplicates && <p style={{ color: "var(--blood)", fontSize: "0.72rem", textAlign: "center", letterSpacing: "0.1em", animation: "startle 0.5s ease" }}>Players must use unique identifiers.</p>}
            <button className="btn-primary" onClick={handleStart} disabled={!isValid || !namesValid}><span>BEGIN THE NIGHT ✦</span></button>
            <button className="btn-ghost" onClick={() => setStep("config")}>← Back to Setup</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <ParticleCanvas mode="embers" />
      <AmbientOrb color="#e63946" x={15} y={25} size={500} delay={0} />
      <AmbientOrb color="#c9a84c" x={85} y={75} size={400} delay={6} />
      <AmbientOrb color="#4cc9f0" x={50} y={10} size={280} delay={3} />

      <div style={{ textAlign: "center", marginBottom: 36, animation: "fadeDown 0.7s ease forwards" }}>
        <div className="fraktur" style={{ fontSize: "clamp(3.5rem, 14vw, 6rem)", color: "#e63946", textShadow: "0 0 40px #e6394688, 0 0 80px #e6394430", animation: "breathe 4s ease-in-out infinite", lineHeight: 1, marginBottom: 12 }}>Mafia</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
          <div style={{ height: 1, width: 44, background: "linear-gradient(90deg, transparent, var(--gold))" }} />
          <span style={{ color: "var(--gold)", fontSize: "0.6rem", letterSpacing: "0.35em" }}>A GAME OF DECEPTION</span>
          <div style={{ height: 1, width: 44, background: "linear-gradient(90deg, var(--gold), transparent)" }} />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 28, width: "100%", maxWidth: 420, animation: "fadeUp 0.6s 0.15s ease both" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "var(--mist)", fontSize: "0.68rem", letterSpacing: "0.22em" }}>PLAYERS</span>
            <span className="playfair" style={{ color: "var(--gold)", fontSize: "1.3rem" }}>{playerCount}</span>
          </div>
          <input type="range" min={5} max={15} value={playerCount} onChange={e => { const n = parseInt(e.target.value); setPlayerCount(n); const maxM = Math.floor((n - specials - 1) / 2); if (mafiaCount > maxM) setMafiaCount(Math.max(1, maxM)); }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "var(--mist)", fontSize: "0.68rem", letterSpacing: "0.22em" }}>MAFIA</span>
            <span className="playfair" style={{ color: "var(--blood)", fontSize: "1.3rem" }}>{mafiaCount}</span>
          </div>
          <input type="range" min={1} max={Math.max(1, Math.floor((playerCount - specials - 1) / 2))} value={mafiaCount} onChange={e => setMafiaCount(parseInt(e.target.value))} style={{ accentColor: "var(--blood)" }} />
        </div>

        <div className="divider" />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            { key: "doctor", label: "Doctor", sub: "Saves one life per night", state: hasDoctor, set: setHasDoctor, color: "#2ecc71", emoji: "💉" },
            { key: "detective", label: "Detective", sub: "Investigates one player per night", state: hasDetective, set: setHasDetective, color: "#4cc9f0", emoji: "🕵️" },
          ].map(({ key, label, sub, state, set, color, emoji }) => (
            <button key={key} onClick={() => set(!state)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: state ? `${color}14` : "rgba(13,13,26,0.6)", border: `1px solid ${state ? color + "55" : "rgba(255,255,255,0.07)"}`, borderRadius: 2, cursor: "pointer", transition: "all 0.25s", textAlign: "left" }}>
              <span style={{ fontSize: "1.3rem" }}>{emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: state ? color : "var(--mist)", fontSize: "0.83rem", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</div>
                <div style={{ color: "var(--mist)", fontSize: "0.68rem", opacity: 0.7 }}>{sub}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${state ? color : "rgba(255,255,255,0.2)"}`, background: state ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "#000", transition: "all 0.25s", boxShadow: state ? `0 0 12px ${color}88` : "none" }}>{state ? "✓" : ""}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "12px 16px", marginBottom: 24, background: "rgba(3,3,10,0.5)", borderRadius: 2 }}>
          <Pip count={mafiaCount} color="#e63946" label="Mafia" />
          {hasDoctor && <Pip count={1} color="#2ecc71" label="Doctor" />}
          {hasDetective && <Pip count={1} color="#4cc9f0" label="Detective" />}
          <Pip count={Math.max(0, villagerCount)} color="#f4a261" label="Town" />
        </div>

        {!isValid && <p style={{ color: "var(--blood)", fontSize: "0.72rem", textAlign: "center", marginBottom: 16, letterSpacing: "0.1em", animation: "startle 0.5s ease" }}>Need at least 1 Villager — reduce roles or add players</p>}
        <button className="btn-primary" onClick={() => setStep("names")} disabled={!isValid}><span>CONTINUE →</span></button>
      </div>
    </div>
  );
}

// 🃏 ROLE REVEAL SCREEN
export function RoleRevealScreen({ players, revealIndex, onRevealNext, onAllRevealed, speak }) {
  const [showing, setShowing] = useState(false);
  const [ripple, setRipple] = useState(false);
  const player = players[revealIndex];
  const role = ROLES[player?.role];
  const isLast = revealIndex === players.length - 1;

  function handleReveal() {
    setRipple(true);
    setTimeout(() => { setRipple(false); setShowing(true); }, 450);
    // Silent reveal as requested
  }

  function handleNext() {
    setShowing(false);
    setTimeout(() => { if (isLast) onAllRevealed(); else onRevealNext(); }, 350);
  }

  return (
    <div className="screen" style={{ background: "radial-gradient(ellipse at 50% 30%, #0a0520 0%, #03030a 80%)" }}>
      <ParticleCanvas mode="embers" />
      <AmbientOrb color={showing ? role.color : "#c9a84c"} x={50} y={30} size={500} delay={0} />
      <div style={{ position: "fixed", top: 22, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7, zIndex: 10 }}>
        {players.map((_, i) => (<div key={i} style={{ width: i === revealIndex ? 26 : 8, height: 3, borderRadius: 2, background: i < revealIndex ? "var(--gold)" : i === revealIndex ? "var(--blood)" : "rgba(255,255,255,0.08)", transition: "all 0.4s ease", boxShadow: i === revealIndex ? "0 0 10px var(--blood)" : "none" }} />))}
      </div>

      {!showing ? (
        <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease forwards" }}>
          <div style={{ width: 110, height: 110, borderRadius: "50%", border: "1px solid var(--border)", background: "radial-gradient(circle, #1a1a2e, #07070f)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "3rem", animation: "breathe 3s ease-in-out infinite", position: "relative", cursor: "pointer", boxShadow: "0 0 40px rgba(201,168,76,0.1), inset 0 0 30px rgba(0,0,0,0.5)" }} onClick={handleReveal}>
            {ripple && <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "2px solid var(--gold)", animation: "ripple 0.6s ease-out forwards" }} />}
            👁️
          </div>
          <p style={{ color: "var(--mist)", fontSize: "0.65rem", letterSpacing: "0.3em", marginBottom: 8 }}>YOUR FATE AWAITS</p>
          <h2 className="playfair gold-text" style={{ fontSize: "clamp(1.8rem, 7vw, 2.5rem)", marginBottom: 28 }}>{player.name}</h2>
          <p style={{ color: "var(--mist)", fontSize: "0.8rem", marginBottom: 36, fontStyle: "italic" }}>Hold the device close. Only you should see.</p>
          <button className="btn-primary" onClick={handleReveal}><span>REVEAL MY ROLE</span></button>
        </div>
      ) : (
        <div style={{ textAlign: "center", animation: "revealCard 0.65s cubic-bezier(0.23,1,0.32,1) forwards" }}>
          <div style={{ width: 130, height: 130, borderRadius: "50%", border: `2px solid ${role.color}`, background: `radial-gradient(circle, ${role.color}22, #07070f)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "3.8rem", boxShadow: `0 0 50px ${role.glow}, 0 0 100px ${role.color}18`, animation: "float 3s ease-in-out infinite" }}>{role.emoji}</div>
          <p style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.32em", marginBottom: 6 }}>YOU ARE THE</p>
          <h2 className="playfair" style={{ fontSize: "clamp(2rem, 8vw, 3rem)", color: role.color, textShadow: `0 0 30px ${role.color}`, marginBottom: 20 }}>{role.name}</h2>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${role.color}55, transparent)`, marginBottom: 20 }} />
          <p className="playfair" style={{ color: "var(--ghost)", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.8, maxWidth: 290, margin: "0 auto 36px" }}>"{role.description}"</p>
          <button className="btn-primary" onClick={handleNext}><span>{isLast ? "✦ BEGIN THE GAME ✦" : "DONE — PASS THE DEVICE"}</span></button>
        </div>
      )}
    </div>
  );
}

// 🌑 NIGHT PHASE SCREEN
export function NightPhaseScreen({ players, round, hasDoctor, hasDetective, onNightComplete, speak }) {
  const alive = players.filter(p => p.alive);
  const mafiaPlayers = players.filter(p => p.role === "mafia" && p.alive);
  const doctorPlayer = players.find(p => p.role === "doctor" && p.alive);
  const detectivePlayer = players.find(p => p.role === "detective" && p.alive);

  const steps = ["intro"];
  if (mafiaPlayers.length) steps.push("countdown", "mafia");
  if (hasDoctor && doctorPlayer) steps.push("doctor");
  if (hasDetective && detectivePlayer) steps.push("detective");
  steps.push("sleeping");

  const [stepIdx, setStepIdx] = useState(0);
  const [actions, setActions] = useState({ mafiaTarget: null, doctorSave: null, detectiveTarget: null });
  const [detectiveResult, setDetectiveResult] = useState(null);
  const step = steps[stepIdx];

  useEffect(() => {
    const lines = { intro: NARRATOR.spoken.nightFalls, countdown: NARRATOR.spoken.eyesClosed, mafia: NARRATOR.spoken.mafiaWakes, doctor: NARRATOR.spoken.doctorWakes, detective: NARRATOR.spoken.detectiveWakes, sleeping: NARRATOR.spoken.allSleep };
    if (lines[step]) speak(lines[step]);
  }, [step]);

  function advance() {
    if (stepIdx < steps.length - 1) { setDetectiveResult(null); setStepIdx(s => s + 1); }
    else onNightComplete(actions);
  }

  if (step === "intro") {
    return (
      <div className="screen scanline-fx" style={{ background: "radial-gradient(ellipse at 50% 20%, #0f0520 0%, #03030a 80%)" }}>
        <ParticleCanvas mode="embers" />
        <AmbientOrb color="#4a0080" x={30} y={20} size={400} delay={0} />
        <AmbientOrb color="#000066" x={70} y={60} size={300} delay={5} />
        <div style={{ textAlign: "center", animation: "fadeUp 0.8s ease forwards" }}>
          <div style={{ fontSize: "5rem", marginBottom: 24, animation: "float 4s ease-in-out infinite", filter: "drop-shadow(0 0 24px #6644aa)" }}>🌙</div>
          <div className="fraktur" style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", color: "#9955cc", textShadow: "0 0 30px #9955cc88", marginBottom: 10 }}>Night Falls</div>
          <p style={{ color: "var(--mist)", fontSize: "0.65rem", letterSpacing: "0.25em", marginBottom: 8 }}>ROUND {round}</p>
          <div style={{ height: 1, width: 200, background: "linear-gradient(90deg,transparent,#9955cc55,transparent)", margin: "20px auto" }} />
          <p className="playfair" style={{ color: "var(--ghost)", fontStyle: "italic", fontSize: "clamp(1rem,4vw,1.25rem)", lineHeight: 1.8, maxWidth: 320, margin: "0 auto 44px" }}>"Darkness descends upon the town.<br />Close your eyes and trust no one."</p>
          <button className="btn-primary" onClick={advance}><span>EVERYONE CLOSE YOUR EYES</span></button>
        </div>
      </div>
    );
  }

  if (step === "countdown") {
    return (
      <div className="screen" style={{ background: "#03030a" }}>
        <AmbientOrb color="#e63946" x={50} y={50} size={700} delay={0} />
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--mist)", fontSize: "0.65rem", letterSpacing: "0.3em", marginBottom: 16 }}>MAKE SURE ALL EYES ARE CLOSED</p>
          <p className="playfair" style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic", fontSize: "1rem", marginBottom: 52 }}>The Mafia is about to be called…</p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 52 }}><CountdownRing seconds={5} onComplete={advance} color="#e63946" size={240} /></div>
          <div style={{ padding: "12px 28px", background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 2, display: "inline-block" }}>
            <p style={{ color: "rgba(230,57,70,0.7)", fontSize: "0.7rem", letterSpacing: "0.2em" }}>DO NOT OPEN YOUR EYES</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "mafia") return <NightAction roleLabel="MAFIA" roleColor="#e63946" roleGlow="#e6394640" forPlayers={mafiaPlayers.map(p => p.name).join(" & ")} prompt="Who shall be silenced tonight?" choices={alive.filter(p => !mafiaPlayers.find(m => m.id === p.id))} selected={actions.mafiaTarget} onSelect={id => setActions({ ...actions, mafiaTarget: id })} onConfirm={advance} />;
  if (step === "doctor") return <NightAction roleLabel="DOCTOR" roleColor="#2ecc71" roleGlow="#2ecc7140" forPlayers={doctorPlayer?.name} prompt="Who will you shield from death?" choices={alive} selected={actions.doctorSave} onSelect={id => setActions({ ...actions, doctorSave: id })} onConfirm={advance} />;
  if (step === "detective") {
    function check(p) { const full = players.find(pl => pl.id === p.id); setActions({ ...actions, detectiveTarget: p.id }); setDetectiveResult(full.role === "mafia" ? { text: `${p.name} IS Mafia.`, bad: true } : { text: `${p.name} is NOT Mafia.`, bad: false }); }
    return <NightAction roleLabel="DETECTIVE" roleColor="#4cc9f0" roleGlow="#4cc9f040" forPlayers={detectivePlayer?.name} prompt="Who do you investigate tonight?" choices={alive.filter(p => p.id !== detectivePlayer?.id)} selected={actions.detectiveTarget} onSelect={p => check({ ...alive.find(a => a.id === p) })} onConfirm={advance} resultText={detectiveResult} />;
  }

  // SLEEPING STATE - Replaced Button with Timer
  if (step === "sleeping") {
    return (
      <div className="screen" style={{ background: "radial-gradient(ellipse at 50% 80%, #0f0520 0%, #03030a 80%)" }}>
        <ParticleCanvas mode="embers" />
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease forwards" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: 24, animation: "breathe 3s ease-in-out infinite" }}>😴</div>
          <h2 className="playfair" style={{ color: "var(--mist)", fontSize: "1.6rem", marginBottom: 10 }}>The Night Passes</h2>
          <p style={{ color: "var(--mist)", fontSize: "0.75rem", letterSpacing: "0.15em", marginBottom: 44, opacity: 0.7 }}>EVERYONE MAY OPEN THEIR EYES</p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <CountdownRing seconds={5} onComplete={advance} color="#c9a84c" size={160} />
            <p className="playfair" style={{ color: "var(--gold)", fontSize: "0.9rem", fontStyle: "italic" }}>Dawn approaches...</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ☀️ DAY PHASE SCREEN
export function DayPhaseScreen({ eliminated, round, eventLogs, onDiscussionEnd, speak }) {
  const SECS = 120;
  const [timeLeft, setTimeLeft] = useState(SECS);
  const [mode, setMode] = useState("reveal");
  const [logOpen, setLogOpen] = useState(false);
  const role = eliminated ? ROLES[eliminated.role] : null;

  useEffect(() => { speak(NARRATOR.spoken.dayBreaks(eliminated?.name || null)); }, []);
  useEffect(() => { if (mode !== "discuss") return; if (timeLeft <= 0) { onDiscussionEnd(); return; } const t = setTimeout(() => setTimeLeft(s => s - 1), 1000); return () => clearTimeout(t); }, [timeLeft, mode]);
  const mins = Math.floor(timeLeft / 60); const secs = String(timeLeft % 60).padStart(2, "0"); const pct = (timeLeft / SECS) * 100;

  return (
    <div className="screen" style={{ background: `radial-gradient(ellipse at 50% 0%, ${eliminated ? "#1a0800" : "#001a08"} 0%, #03030a 70%)` }}>
      <ParticleCanvas mode="embers" />
      <AmbientOrb color={eliminated ? "#c9702a" : "#2ecc71"} x={50} y={0} size={600} delay={0} />
      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 10 }}><span style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.22em" }}>ROUND {round} · DAY</span></div>
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
        {mode === "reveal" && (
          <div style={{ animation: "fadeUp 0.7s ease forwards" }}>
            <div style={{ fontSize: "3.2rem", marginBottom: 22 }}>☀️</div>
            {eliminated ? (<><p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic", fontSize: "0.9rem", marginBottom: 10 }}>Dawn reveals a grim sight…</p><h2 className="playfair blood-text" style={{ fontSize: "clamp(2rem, 8vw, 3rem)", marginBottom: 8 }}>{eliminated.name}</h2><p style={{ color: "var(--mist)", fontSize: "0.78rem", letterSpacing: "0.1em", marginBottom: 28 }}>was found dead in the night</p><div className="glass-card" style={{ padding: "22px 28px", marginBottom: 36, border: `1px solid ${role.color}40`, background: `${role.color}0a`, animation: "revealCard 0.6s 0.2s ease both" }}><div style={{ fontSize: "2.8rem", marginBottom: 10 }}>{role.emoji}</div><div style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.22em", marginBottom: 5 }}>REVEALED ROLE</div><div className="playfair" style={{ color: role.color, fontSize: "1.5rem", textShadow: `0 0 20px ${role.color}` }}>{role.name}</div></div></>) : (<><h2 className="playfair" style={{ color: "#2ecc71", fontSize: "clamp(1.5rem,6vw,2.2rem)", marginBottom: 12, textShadow: "0 0 20px #2ecc7180" }}>The Town Slept Safely</h2><p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic", marginBottom: 36, lineHeight: 1.7 }}>No one was eliminated tonight.<br />The Doctor's vigil held.</p></>)}
            <button className="btn-primary" onClick={() => { setMode("discuss"); speak(NARRATOR.spoken.discuss); }}><span>BEGIN DISCUSSION ⏱️</span></button>
          </div>
        )}
        {mode === "discuss" && (
          <div style={{ animation: "fadeUp 0.5s ease forwards" }}>
            <h3 className="playfair" style={{ color: "var(--gold)", fontSize: "1.2rem", marginBottom: 36, fontStyle: "italic" }}>"Who among you is the deceiver?"</h3>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 36 }}><CountdownRing seconds={timeLeft} onComplete={onDiscussionEnd} color={timeLeft < 30 ? "#e63946" : "#c9a84c"} size={180} autoStart={false} /><span className="playfair" style={{ color: timeLeft < 30 ? "var(--blood)" : "var(--gold)", fontSize: "2rem", transition: "color 0.5s" }}>{mins}:{secs}</span></div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 2, height: 3, marginBottom: 32, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: timeLeft < 30 ? "linear-gradient(90deg,#9b1c26,#e63946)" : "linear-gradient(90deg,#8b6914,#c9a84c)", transition: "width 1s linear, background 0.5s", boxShadow: `0 0 12px ${timeLeft < 30 ? "#e63946" : "#c9a84c"}` }} /></div>
            <button className="btn-ghost" onClick={onDiscussionEnd}>Skip to Voting →</button>
          </div>
        )}
        <button onClick={() => setLogOpen(true)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, background: "rgba(0,0,0,0.6)", border: "1px solid var(--border)", borderRadius: "50%", width: 50, height: 50, color: "var(--mist)", fontSize: "1.2rem", cursor: "pointer", boxShadow: "0 0 10px rgba(0,0,0,0.5)" }} title="Game Log">📜</button>
      </div>
      <GameLogModal isOpen={logOpen} onClose={() => setLogOpen(false)} eventLogs={eventLogs} />
    </div>
  );
}

// 🗳️ VOTING PHASE SCREEN
export function VotingPhaseScreen({ players, eventLogs, onVotingComplete, speak }) {
  const alive = players.filter(p => p.alive);
  const [votes, setVotes] = useState({});
  const [voterIdx, setVoterIdx] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [logOpen, setLogOpen] = useState(false);
  const voter = alive[voterIdx];
  const done = voterIdx >= alive.length;

  useEffect(() => { speak(NARRATOR.spoken.voteTime); }, []);

  if (done) return (<div className="screen" style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0505 0%, #03030a 70%)" }}><AmbientOrb color="#e63946" x={50} y={40} size={600} delay={0} /><div style={{ textAlign: "center", animation: "scalePop 0.5s ease forwards" }}><div style={{ fontSize: "4.5rem", marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>⚖️</div><h2 className="playfair gold-text" style={{ fontSize: "2.2rem", marginBottom: 10 }}>All Votes Cast</h2><p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic", marginBottom: 44 }}>The fate of one soul hangs in the balance</p><button className="btn-primary" onClick={() => { speak("All votes are in. The town has spoken."); onVotingComplete(votes); }}><span>REVEAL THE VERDICT</span></button></div></div>);

  return (
    <div className="screen" style={{ background: "radial-gradient(ellipse at 50% 10%, #0d0a1a 0%, #03030a 70%)" }}>
      <AmbientOrb color="#9b59b6" x={30} y={20} size={400} delay={0} />
      <AmbientOrb color="#e63946" x={70} y={70} size={300} delay={3} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.04)", zIndex: 20 }}><div style={{ height: "100%", width: `${(voterIdx / alive.length) * 100}%`, background: "linear-gradient(90deg,#9b59b6,#e63946)", transition: "width 0.5s ease", boxShadow: "0 0 8px #e63946" }} /></div>
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.4s ease forwards" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.28em", marginBottom: 8 }}>VOTER {voterIdx + 1} OF {alive.length}</p><h2 className="playfair gold-text" style={{ fontSize: "clamp(1.8rem,7vw,2.6rem)" }}>{voter?.name}</h2></div>
        {hasVoted ? (<div style={{ textAlign: "center" }}><div className="glass-card" style={{ padding: 32, marginBottom: 24 }}><div style={{ fontSize: "3rem", marginBottom: 14 }}>🗳️</div><p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic" }}>Vote recorded.<br />Pass the device.</p></div><button className="btn-primary" onClick={() => { setHasVoted(false); setSelected(null); setVoterIdx(v => v + 1); }}><span>{voterIdx < alive.length - 1 ? "NEXT VOTER →" : "SEE RESULTS"}</span></button></div>) : (<><p style={{ color: "var(--mist)", fontSize: "0.75rem", letterSpacing: "0.1em", textAlign: "center", marginBottom: 20 }}>Who do you vote to eliminate?</p><div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>{alive.filter(p => p.id !== voter?.id).map((p, i) => (<button key={p.id} className={`player-btn${selected === p.id ? " selected" : ""}`} onClick={() => setSelected(p.id)} style={{ animation: `fadeUp ${0.1 + i * 0.05}s ease both` }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: selected === p.id ? "#e63946" : "rgba(255,255,255,0.15)", boxShadow: selected === p.id ? "0 0 8px #e63946" : "none", transition: "all 0.2s" }} />{p.name}</div></button>))}</div><button className="btn-primary" onClick={() => { setVotes({ ...votes, [voter.id]: selected }); setHasVoted(true); }} disabled={selected === null}><span>CAST VOTE</span></button></>)}
        <button onClick={() => setLogOpen(true)} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 100, background: "rgba(0,0,0,0.6)", border: "1px solid var(--border)", borderRadius: "50%", width: 50, height: 50, color: "var(--mist)", fontSize: "1.2rem", cursor: "pointer", boxShadow: "0 0 10px rgba(0,0,0,0.5)" }} title="Game Log">📜</button>
      </div>
      <GameLogModal isOpen={logOpen} onClose={() => setLogOpen(false)} eventLogs={eventLogs} />
    </div>
  );
}

// 🎯 RESULT SCREEN
export function ResultScreen({ eliminated, tie, onContinue, speak }) {
  useEffect(() => { speak(NARRATOR.spoken.voteReveal(eliminated?.name || null)); }, []);
  const role = eliminated ? ROLES[eliminated.role] : null;

  return (
    <div className="screen" style={{ background: "radial-gradient(ellipse at 50% 30%, #1a0505 0%, #03030a 70%)" }}>
      <ParticleCanvas mode={eliminated ? "blood" : "embers"} />
      <AmbientOrb color={eliminated ? "#e63946" : "#c9a84c"} x={50} y={30} size={600} delay={0} />
      <div style={{ textAlign: "center", maxWidth: 420, animation: "fadeUp 0.7s ease forwards" }}>
        <div style={{ fontSize: "4rem", marginBottom: 20 }}>⚖️</div>
        {eliminated ? (<><p style={{ color: "var(--mist)", fontSize: "0.65rem", letterSpacing: "0.25em", marginBottom: 12 }}>THE TOWN HAS SPOKEN</p><h2 className="playfair blood-text" style={{ fontSize: "clamp(2rem,8vw,3rem)", marginBottom: 8 }}>{eliminated.name}</h2><p style={{ color: "var(--mist)", fontStyle: "italic", marginBottom: 28 }}>has been cast out from the town</p><div className="glass-card" style={{ padding: "24px 28px", marginBottom: 36, border: `1px solid ${role.color}50`, background: `${role.color}0a`, animation: "revealCard 0.6s 0.3s ease both" }}><div style={{ fontSize: "3rem", marginBottom: 10 }}>{role.emoji}</div><div style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.22em", marginBottom: 5 }}>THEY WERE THE</div><div className="playfair" style={{ color: role.color, fontSize: "1.9rem", textShadow: `0 0 20px ${role.color}` }}>{role.name}</div></div></>) : (<><h2 className="playfair gold-text" style={{ fontSize: "1.9rem", marginBottom: 16 }}>It's a Tie</h2><p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic", marginBottom: 36, lineHeight: 1.8 }}>The town could not agree.<br />No one was eliminated today.</p></>)}
        <button className="btn-primary" onClick={onContinue}><span>NEXT ROUND →</span></button>
      </div>
    </div>
  );
}

// 🏆 GAME OVER SCREEN
export function GameOverScreen({ winner, players, onRestart, speak }) {
  const isMafia = winner === "mafia";
  useEffect(() => { speak(isMafia ? NARRATOR.spoken.mafiaWins : NARRATOR.spoken.villagersWin); }, []);

  return (
    <div className="screen" style={{ background: `radial-gradient(ellipse at 50% 25%, ${isMafia ? "#2d0000" : "#002d0f"} 0%, #03030a 70%)` }}>
      <ParticleCanvas mode={isMafia ? "blood" : "embers"} />
      <AmbientOrb color={isMafia ? "#e63946" : "#2ecc71"} x={50} y={15} size={700} delay={0} />
      <AmbientOrb color={isMafia ? "#9b1c26" : "#1a7a40"} x={20} y={75} size={400} delay={4} />
      <div style={{ width: "100%", maxWidth: 460, textAlign: "center" }}>
        <div style={{ animation: "victoryFlare 0.9s ease forwards" }}>
          <div style={{ fontSize: "6rem", marginBottom: 16, animation: "float 3s ease-in-out infinite", filter: `drop-shadow(0 0 35px ${isMafia ? "#e63946" : "#2ecc71"})` }}>{isMafia ? "🔪" : "🕯️"}</div>
          <div className="fraktur" style={{ fontSize: "clamp(2.5rem,10vw,5rem)", color: isMafia ? "#e63946" : "#2ecc71", textShadow: `0 0 40px ${isMafia ? "#e6394888" : "#2ecc7188"}, 0 0 80px ${isMafia ? "#e6394840" : "#2ecc7140"}`, marginBottom: 10, lineHeight: 1.1 }}>{isMafia ? "Mafia Wins" : "Town Wins"}</div>
          <p className="playfair" style={{ color: "var(--mist)", fontStyle: "italic", fontSize: "1rem", marginBottom: 36 }}>{isMafia ? "The darkness has consumed the town." : "Justice prevails. The Mafia is unmasked."}</p>
        </div>
        <div className="glass-card" style={{ padding: 20, marginBottom: 32, textAlign: "left", animation: "fadeUp 0.6s 0.4s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.2em" }}>PLAYER</span><span style={{ color: "var(--mist)", fontSize: "0.62rem", letterSpacing: "0.2em" }}>ROLE</span></div>
          {players.map((p, i) => { const r = ROLES[p.role]; return (<div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: p.alive ? 1 : 0.4, animation: `fadeUp ${0.5 + i * 0.06}s ease both` }}><span style={{ color: p.alive ? "var(--ghost)" : "var(--mist)", display: "flex", alignItems: "center", gap: 8, fontSize: "0.95rem" }}><span style={{ fontSize: "0.7rem" }}>{p.alive ? "🟢" : "💀"}</span> {p.name}</span><span style={{ color: r.color, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>{r.emoji} {r.name}</span></div>); })}
        </div>
        <button className="btn-primary" onClick={onRestart} style={{ animation: "fadeUp 0.6s 0.85s ease both" }}><span>PLAY AGAIN</span></button>
      </div>
    </div>
  );
}

// Helpers
function Pip({ count, color, label }) {
  return (<div style={{ display: "flex", alignItems: "center", gap: 4 }}>{Array.from({ length: Math.max(0, count) }).map((_, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />))}<span style={{ color: "var(--mist)", fontSize: "0.62rem", marginLeft: 2 }}>{label}</span></div>);
}

function NightAction({ roleLabel, roleColor, roleGlow, forPlayers, prompt, choices, selected, onSelect, onConfirm, resultText }) {
  return (
    <div className="screen" style={{ background: "radial-gradient(ellipse at 50% 0%, #070712 0%, #03030a 100%)" }}>
      <AmbientOrb color={roleColor} x={50} y={10} size={380} delay={0} />
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.45s ease forwards" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "9px 22px", background: `${roleColor}14`, border: `1px solid ${roleColor}44`, borderRadius: 2, marginBottom: 8 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: roleColor, boxShadow: `0 0 10px ${roleColor}`, animation: "breathe 1.5s ease-in-out infinite" }} /><span style={{ color: roleColor, fontSize: "0.68rem", letterSpacing: "0.28em" }}>{roleLabel}</span></div>
          <p style={{ color: "var(--mist)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>for: <span style={{ color: "var(--ghost)" }}>{forPlayers}</span></p>
        </div>
        <h2 className="playfair" style={{ textAlign: "center", fontSize: "1.4rem", color: "var(--text)", fontStyle: "italic", marginBottom: 28, lineHeight: 1.4 }}>"{prompt}"</h2>
        {resultText ? (<div style={{ textAlign: "center", padding: "28px 20px", background: resultText.bad ? "rgba(230,57,70,0.1)" : "rgba(46,204,113,0.1)", border: `1px solid ${resultText.bad ? "#e6394640" : "#2ecc7140"}`, borderRadius: 2, marginBottom: 28, animation: "scalePop 0.4s ease forwards" }}><div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{resultText.bad ? "⚠️" : "✅"}</div><p className="playfair" style={{ color: resultText.bad ? "#e63946" : "#2ecc71", fontSize: "1.2rem", fontStyle: "italic" }}>{resultText.text}</p></div>) : (<div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>{choices.map((p, i) => (<button key={p.id} className={`player-btn${selected === p.id ? " selected" : ""}`} onClick={() => onSelect(p.id)} style={{ animation: `fadeUp ${0.1 + i * 0.055}s ease both` }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: selected === p.id ? roleColor : "rgba(255,255,255,0.15)", boxShadow: selected === p.id ? `0 0 8px ${roleColor}` : "none", transition: "all 0.2s" }} />{p.name}</div></button>))}</div>)}
        <button className="btn-primary" onClick={onConfirm} disabled={!resultText && selected === null}><span>{resultText ? "UNDERSTOOD →" : "CONFIRM CHOICE"}</span></button>
      </div>
    </div>
  );
}