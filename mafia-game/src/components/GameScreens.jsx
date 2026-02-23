import React, { useState, useEffect } from "react";
import { ROLES, NARRATOR } from "../utils/constants";
import { Screen, Card, Btn, Divider, NarratorText } from "./UI";

// --- SETUP SCREEN ---
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

  const specialRoles = (hasDoctor ? 1 : 0) + (hasDetective ? 1 : 0);
  const villagerCount = playerCount - mafiaCount - specialRoles;
  const isValid = villagerCount >= 1 && mafiaCount >= 1;

  function handleStart() {
    onStart(playerNames, { mafia: mafiaCount, doctor: hasDoctor ? 1 : 0, detective: hasDetective ? 1 : 0 });
  }

  if (step === "names") {
    return (
      <Screen>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h1 className="cinzel" style={{ textAlign: "center", fontSize: "1.4rem", color: "var(--accent-gold)", marginBottom: 8 }}>ENTER PLAYER NAMES</h1>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {playerNames.map((name, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--text-muted)", width: 24, textAlign: "right", fontSize: "0.9rem" }}>{i + 1}.</span>
                <input value={name} onChange={(e) => { const updated = [...playerNames]; updated[i] = e.target.value; setPlayerNames(updated); }}
                  style={{ flex: 1, background: "var(--bg-panel)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 14px", color: "var(--text-primary)", fontSize: "1rem", fontFamily: "'Crimson Pro', serif", outline: "none" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn onClick={handleStart} disabled={!isValid || playerNames.some((n) => !n.trim())}>BEGIN THE GAME</Btn>
            <Btn onClick={() => setStep("config")} variant="ghost">← Back</Btn>
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>🎭</div>
        <h1 className="cinzel" style={{ fontSize: "clamp(1.8rem, 6vw, 2.6rem)", background: "linear-gradient(135deg, #d4a017, #f0c040, #d4a017)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite", lineHeight: 1.2 }}>MAFIA</h1>
      </div>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "var(--accent-gold)", fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 10 }}>PLAYERS — {playerCount}</label>
          <input type="range" min={5} max={15} value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))} style={{ width: "100%", accentColor: "var(--accent-gold)" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "#e63946", fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 10 }}>MAFIA — {mafiaCount}</label>
          <input type="range" min={1} max={Math.max(1, Math.floor((playerCount - specialRoles - 1) / 2))} value={mafiaCount} onChange={(e) => setMafiaCount(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#e63946" }} />
        </div>
        <Divider />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[{ key: "doc", label: "Doctor 💊", s: hasDoctor, f: setHasDoctor, c: "#27ae60" }, { key: "det", label: "Detective 🔍", s: hasDetective, f: setHasDetective, c: "#2980b9" }].map((t) => (
            <button key={t.key} onClick={() => t.f(!t.s)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: t.s ? `${t.c}22` : "var(--bg-panel)", border: `1.5px solid ${t.s ? t.c : "rgba(255,255,255,0.08)"}`, borderRadius: 6, padding: "12px 16px", color: t.s ? t.c : "var(--text-muted)", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: "1rem", transition: "all 0.2s" }}>
              <span>{t.label}</span><span style={{ width: 20, height: 20, borderRadius: "50%", background: t.s ? t.c : "transparent", border: `2px solid ${t.s ? t.c : "var(--text-muted)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>{t.s ? "✓" : ""}</span>
            </button>
          ))}
        </div>
        <Btn onClick={() => setStep("names")} disabled={!isValid}>NEXT →</Btn>
      </Card>
    </Screen>
  );
}

// --- ROLE REVEAL SCREEN ---
export function RoleRevealScreen({ players, revealIndex, onRevealNext, onAllRevealed, speak }) {
  const [showing, setShowing] = useState(false);
  const player = players[revealIndex];
  const role = ROLES[player?.role];
  const isLast = revealIndex === players.length - 1;

  function handleReveal() {
    setShowing(true);
    speak(`${player.name}. You are the ${role.name}. ${role.description}`);
  }
  function handleNext() {
    setShowing(false);
    setTimeout(() => { isLast ? onAllRevealed() : onRevealNext(); }, 300);
  }

  return (
    <Screen style={{ background: "var(--bg-dark)" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
        {players.map((_, i) => (<div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < revealIndex ? "var(--accent-gold)" : i === revealIndex ? "#fff" : "var(--bg-panel)", transition: "all 0.3s" }} />))}
      </div>
      {!showing ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: 24 }}>👁️</div>
          <h2 className="cinzel" style={{ fontSize: "1.6rem", color: "var(--accent-gold)", marginBottom: 8 }}>{player.name}</h2>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 32 }}>Make sure no one else is watching</p>
          <Btn onClick={handleReveal}>REVEAL MY ROLE</Btn>
        </div>
      ) : (
        <div style={{ textAlign: "center", animation: "roleReveal 0.5s ease forwards" }}>
          <div style={{ fontSize: "5rem", marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>{role.emoji}</div>
          <h2 className="cinzel" style={{ fontSize: "2.2rem", color: role.color, marginBottom: 8 }}>{role.name.toUpperCase()}</h2>
          <Divider />
          <p style={{ fontStyle: "italic", fontSize: "1.1rem", color: "var(--text-primary)", maxWidth: 300, margin: "0 auto 32px", lineHeight: 1.6 }}>{role.description}</p>
          <Btn onClick={handleNext}>{isLast ? "START GAME" : "DONE — PASS DEVICE →"}</Btn>
        </div>
      )}
    </Screen>
  );
}

// --- NIGHT PHASE SCREEN ---
export function NightPhaseScreen({ players, round, hasDoctor, hasDetective, onNightComplete, speak, stop }) {
  const alivePlayers = players.filter((p) => p.alive);
  const mafiaPlayers = players.filter((p) => p.role === "mafia" && p.alive);
  const doctorPlayer = players.find((p) => p.role === "doctor" && p.alive);
  const detectivePlayer = players.find((p) => p.role === "detective" && p.alive);
  
  const nightSteps = ["intro", "mafia"];
  if (hasDoctor && doctorPlayer) nightSteps.push("doctor");
  if (hasDetective && detectivePlayer) nightSteps.push("detective");
  nightSteps.push("sleeping");

  const [stepIndex, setStepIndex] = useState(0);
  const [nightActions, setNightActions] = useState({ mafiaTarget: null, doctorSave: null, detectiveTarget: null });
  const [detectiveResult, setDetectiveResult] = useState(null);
  const currentStep = nightSteps[stepIndex];

  useEffect(() => {
    const lines = { intro: NARRATOR.spoken.nightFalls, mafia: NARRATOR.spoken.mafiaWakes, doctor: NARRATOR.spoken.doctorWakes, detective: NARRATOR.spoken.detectiveWakes, sleeping: NARRATOR.spoken.allSleep };
    if (lines[currentStep]) speak(lines[currentStep]);
  }, [currentStep, speak]);

  function advanceStep() {
    if (stepIndex < nightSteps.length - 1) {
      setDetectiveResult(null);
      setStepIndex(stepIndex + 1);
    } else {
      onNightComplete(nightActions);
    }
  }

  // Internal component for picking players
  const PlayerPicker = ({ prompt, subprompt, onPick, exclude = [], picked = null, resultText = null }) => {
    const choices = alivePlayers.filter((p) => !exclude.includes(p.id));
    return (
      <div style={{ width: "100%", maxWidth: 400 }}>
        <NarratorText text={prompt} subtext={subprompt} />
        <Divider />
        {resultText ? (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ color: "var(--accent-gold)", fontStyle: "italic", fontSize: "1.1rem" }}>{resultText}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {choices.map((p) => (
              <button key={p.id} onClick={() => onPick(p)} style={{ padding: "14px 20px", background: picked === p.id ? "var(--accent-gold)22" : "var(--bg-panel)", border: `1.5px solid ${picked === p.id ? "var(--accent-gold)" : "var(--border)"}`, borderRadius: 6, color: picked === p.id ? "var(--accent-gold)" : "var(--text-primary)", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", textAlign: "left", transition: "all 0.2s" }}>{p.name}</button>
            ))}
          </div>
        )}
        <Btn onClick={advanceStep} disabled={!resultText && picked === null}>{resultText ? "UNDERSTOOD →" : "CONFIRM"}</Btn>
      </div>
    );
  };

  const nightBg = { background: "linear-gradient(180deg, #040408 0%, #0a0a14 100%)" };

  if (currentStep === "intro") return (<Screen style={nightBg}><div style={{ textAlign: "center" }}><div style={{ fontSize: "4rem", marginBottom: 24, animation: "pulse 3s ease-in-out infinite" }}>🌙</div><NarratorText text={NARRATOR.nightFalls} /><div style={{ marginTop: 40 }}><p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 24, fontSize: "0.95rem" }}>Round {round} — Pass the device to the Mafia player(s)</p><Btn onClick={advanceStep}>READY →</Btn></div></div></Screen>);
  if (currentStep === "mafia") return (<Screen style={nightBg}><div style={{ width: "100%", maxWidth: 400 }}><div style={{ textAlign: "center", marginBottom: 24 }}><span style={{ fontSize: "0.85rem", color: "#e63946", letterSpacing: "0.12em" }}>🔪 FOR: {mafiaPlayers.map(p=>p.name).join(" & ")}</span></div><PlayerPicker prompt={NARRATOR.mafiaWakes} subprompt="The rest of the town sleeps…" onPick={(p) => setNightActions({ ...nightActions, mafiaTarget: p.id })} picked={nightActions.mafiaTarget} exclude={mafiaPlayers.map((p) => p.id)} /></div></Screen>);
  if (currentStep === "doctor") return (<Screen style={nightBg}><div style={{ width: "100%", maxWidth: 400 }}><div style={{ textAlign: "center", marginBottom: 24 }}><span style={{ fontSize: "0.85rem", color: "#27ae60", letterSpacing: "0.12em" }}>💊 FOR: {doctorPlayer?.name}</span></div><PlayerPicker prompt={NARRATOR.doctorWakes} subprompt="You can save yourself too." onPick={(p) => setNightActions({ ...nightActions, doctorSave: p.id })} picked={nightActions.doctorSave} /></div></Screen>);
  if (currentStep === "detective") return (<Screen style={nightBg}><div style={{ width: "100%", maxWidth: 400 }}><div style={{ textAlign: "center", marginBottom: 24 }}><span style={{ fontSize: "0.85rem", color: "#2980b9", letterSpacing: "0.12em" }}>🔍 FOR: {detectivePlayer?.name}</span></div><PlayerPicker prompt={NARRATOR.detectiveWakes} subprompt="You'll learn if they are Mafia." onPick={(p) => { setNightActions({ ...nightActions, detectiveTarget: p.id }); setDetectiveResult(p.role === "mafia" ? `⚠️ ${p.name} IS Mafia.` : `✅ ${p.name} is NOT Mafia.`); }} picked={nightActions.detectiveTarget} resultText={detectiveResult} exclude={[detectivePlayer?.id]} /></div></Screen>);
  if (currentStep === "sleeping") return (<Screen style={nightBg}><div style={{ textAlign: "center" }}><div style={{ fontSize: "3rem", marginBottom: 24, animation: "pulse 2s ease-in-out infinite" }}>😴</div><NarratorText text={NARRATOR.allSleep} /><div style={{ marginTop: 40 }}><p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 24, fontSize: "0.95rem" }}>Everyone may open their eyes now.</p><Btn onClick={advanceStep}>DAWN APPROACHES →</Btn></div></div></Screen>);
  return null;
}

// --- DAY PHASE SCREEN ---
export function DayPhaseScreen({ eliminated, round, onDiscussionEnd, speak }) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [discussing, setDiscussing] = useState(false);

  useEffect(() => { speak(NARRATOR.spoken.dayBreaks(eliminated?.name || null)); }, [speak, eliminated]);
  useEffect(() => { if (!discussing) return; if (timeLeft <= 0) { onDiscussionEnd(); return; } const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); return () => clearTimeout(t); }, [timeLeft, discussing, onDiscussionEnd]);

  const pct = ((timeLeft / 120) * 100).toFixed(1);
  return (
    <Screen>
      <div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ fontSize: "3rem", marginBottom: 12 }}>☀️</div><span className="cinzel" style={{ fontSize: "0.85rem", color: "var(--accent-gold)", letterSpacing: "0.15em" }}>ROUND {round} — DAY</span></div>
      <Card style={{ marginBottom: 24, textAlign: "center" }}>
        {eliminated ? (<><p style={{ fontStyle: "italic", color: "var(--text-muted)", marginBottom: 8 }}>The town awakens to find…</p><h2 style={{ fontSize: "2rem", color: "#e63946", fontFamily: "'Cinzel Decorative', serif", marginBottom: 4 }}>{eliminated.name}</h2><p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem" }}>has been eliminated. They were a <span style={{ color: ROLES[eliminated.role].color }}>{ROLES[eliminated.role].emoji} {ROLES[eliminated.role].name}</span>.</p></>) : (<><p style={{ fontStyle: "italic", color: "var(--text-muted)", marginBottom: 8 }}>The town awakens…</p><h2 style={{ fontSize: "1.5rem", color: "#27ae60", fontFamily: "'Cinzel Decorative', serif" }}>✨ No one was eliminated!</h2><p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.9rem", marginTop: 8 }}>The Doctor saved someone last night.</p></>)}
      </Card>
      {discussing ? (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>DISCUSSION TIME</span><span className="cinzel" style={{ fontSize: "1.8rem", color: timeLeft < 30 ? "#e63946" : "var(--accent-gold)", transition: "color 0.5s" }}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</span></div>
          <div style={{ background: "var(--bg-panel)", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 20 }}><div style={{ height: "100%", width: `${pct}%`, background: timeLeft < 30 ? "#e63946" : "var(--accent-gold)", transition: "width 1s linear, background 0.5s", borderRadius: 4 }} /></div>
          <p style={{ textAlign: "center", fontStyle: "italic", color: "var(--text-muted)", marginBottom: 24 }}>{NARRATOR.discuss}</p>
          <Btn onClick={onDiscussionEnd} variant="ghost">Skip to Voting →</Btn>
        </div>
      ) : (<Btn onClick={() => { setDiscussing(true); speak(NARRATOR.spoken.discuss); }}>START DISCUSSION ⏱️</Btn>)}
    </Screen>
  );
}

// --- VOTING PHASE SCREEN ---
export function VotingPhaseScreen({ players, onVotingComplete, speak }) {
  const alivePlayers = players.filter((p) => p.alive);
  const [votes, setVotes] = useState({});
  const [voterIndex, setVoterIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const currentVoter = alivePlayers[voterIndex];
  const allVoted = voterIndex >= alivePlayers.length;

  useEffect(() => { speak(NARRATOR.spoken.voteTime); }, [speak]);

  function handleVote() { setVotes({ ...votes, [currentVoter.id]: selectedTarget }); setHasVoted(true); }
  function handleNext() { setHasVoted(false); setSelectedTarget(null); setVoterIndex(voterIndex + 1); }

  if (allVoted) return (<Screen><div style={{ textAlign: "center", maxWidth: 400 }}><div style={{ fontSize: "3rem", marginBottom: 16 }}>⚖️</div><NarratorText text="All votes are in.\nThe town has spoken." /><Divider /><div style={{ marginTop: 24 }}><Btn onClick={() => { speak("All votes are in. The town has spoken."); onVotingComplete(votes); }}>REVEAL THE RESULT</Btn></div></div></Screen>);

  return (
    <Screen>
      <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>{alivePlayers.map((_, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < voterIndex ? "var(--accent-gold)" : i === voterIndex ? "#fff" : "var(--bg-panel)", transition: "all 0.3s" }} />))}</div>
      <div style={{ textAlign: "center", marginBottom: 8 }}><span style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>🗳️ VOTING</span></div>
      <h2 className="cinzel" style={{ fontSize: "1.4rem", color: "var(--accent-gold)", marginBottom: 4, textAlign: "center" }}>{currentVoter?.name}</h2>
      <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 24, textAlign: "center" }}>Who do you vote to eliminate?</p>
      {hasVoted ? (
        <div style={{ textAlign: "center", maxWidth: 400 }}><Card><p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Vote cast. Pass the device.</p></Card><Btn onClick={handleNext}>{voterIndex < alivePlayers.length - 1 ? "NEXT VOTER →" : "SEE RESULTS"}</Btn></div>
      ) : (
        <div style={{ width: "100%", maxWidth: 400 }}><div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>{alivePlayers.filter((p) => p.id !== currentVoter?.id).map((p) => (<button key={p.id} onClick={() => setSelectedTarget(p.id)} style={{ padding: "14px 20px", background: selectedTarget === p.id ? "#e6394622" : "var(--bg-panel)", border: `1.5px solid ${selectedTarget === p.id ? "#e63946" : "var(--border)"}`, borderRadius: 6, color: selectedTarget === p.id ? "#e63946" : "var(--text-primary)", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", textAlign: "left", transition: "all 0.2s" }}>{p.name}</button>))}</div><Btn onClick={handleVote} disabled={selectedTarget === null}>CAST VOTE</Btn></div>
      )}
    </Screen>
  );
}

// --- RESULT & GAME OVER SCREENS ---
export function ResultScreen({ eliminated, tie, onContinue, speak }) {
  useEffect(() => { speak(NARRATOR.spoken.voteReveal(eliminated?.name || null)); }, [speak, eliminated]);
  return (<Screen><div style={{ textAlign: "center", maxWidth: 400 }}><div style={{ fontSize: "3rem", marginBottom: 16 }}>⚖️</div><NarratorText text={NARRATOR.voteReveal(eliminated?.name || null)} />{eliminated && (<><Divider /><Card style={{ margin: "0 auto 24px" }}><p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 4 }}>They were a</p><span style={{ fontSize: "1.4rem", color: ROLES[eliminated.role].color, fontFamily: "'Cinzel Decorative', serif" }}>{ROLES[eliminated.role].emoji} {ROLES[eliminated.role].name}</span></Card></>)}{tie && <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 24 }}>It was a tie — no one was eliminated.</p>}<Btn onClick={onContinue}>NEXT ROUND →</Btn></div></Screen>);
}

export function GameOverScreen({ winner, players, onRestart, speak }) {
  const isMafia = winner === "mafia";
  useEffect(() => { speak(isMafia ? NARRATOR.spoken.mafiaWins : NARRATOR.spoken.villagersWin); }, [speak, isMafia]);
  return (
    <Screen style={{ background: isMafia ? "linear-gradient(180deg, #1a0505 0%, #0a0a0f 100%)" : "linear-gradient(180deg, #050f05 0%, #0a0a0f 100%)" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}><div style={{ fontSize: "5rem", marginBottom: 16, animation: "float 2s ease-in-out infinite" }}>{isMafia ? "🔪" : "🎉"}</div><h1 className="cinzel" style={{ fontSize: "clamp(2rem, 7vw, 3rem)", color: isMafia ? "#e63946" : "#27ae60", marginBottom: 8 }}>{isMafia ? "MAFIA WINS" : "TOWN WINS"}</h1><Divider /><p style={{ fontStyle: "italic", color: "var(--text-muted)", marginBottom: 24 }}>{isMafia ? NARRATOR.mafiaWins : NARRATOR.villagersWin}</p><Card style={{ marginBottom: 32, textAlign: "left" }}><p className="cinzel" style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginBottom: 12, letterSpacing: "0.1em" }}>ALL ROLES REVEALED</p>{players.map((p) => (<div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", opacity: p.alive ? 1 : 0.5 }}><span style={{ color: p.alive ? "var(--text-primary)" : "var(--text-muted)" }}>{p.alive ? "🟢" : "💀"} {p.name}</span><span style={{ color: ROLES[p.role].color, fontSize: "0.9rem" }}>{ROLES[p.role].emoji} {ROLES[p.role].name}</span></div>))}</Card><Btn onClick={onRestart}>PLAY AGAIN</Btn></div>
    </Screen>
  );
}