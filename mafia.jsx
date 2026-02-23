import { useState, useEffect, useCallback } from "react";



// ─── Constants ───────────────────────────────────────────────────────────────



const ROLES = {

  MAFIA: "Mafia",

  DETECTIVE: "Detective",

  DOCTOR: "Doctor",

  VILLAGER: "Villager",

};



const ROLE_CONFIG = {

  [ROLES.MAFIA]: {

    icon: "🔪",

    color: "#c0392b",

    bg: "#2d0a08",

    description: "Eliminate villagers each night without being caught.",

    team: "mafia",

  },

  [ROLES.DETECTIVE]: {

    icon: "🔍",

    color: "#f39c12",

    bg: "#2d1f08",

    description: "Each night, investigate one player to learn their role.",

    team: "village",

  },

  [ROLES.DOCTOR]: {

    icon: "💊",

    color: "#27ae60",

    bg: "#0a2d16",

    description: "Each night, protect one player from being eliminated.",

    team: "village",

  },

  [ROLES.VILLAGER]: {

    icon: "🏘️",

    color: "#8e9eab",

    bg: "#1a1e22",

    description: "Use your wit to identify and vote out the Mafia.",

    team: "village",

  },

};



const PHASES = {

  SETUP: "setup",

  ROLE_REVEAL: "role_reveal",

  NIGHT_INTRO: "night_intro",

  NIGHT_MAFIA: "night_mafia",

  NIGHT_DETECTIVE: "night_detective",

  NIGHT_DOCTOR: "night_doctor",

  DAY_ANNOUNCEMENT: "day_announcement",

  DAY_DISCUSSION: "day_discussion",

  DAY_VOTE: "day_vote",

  GAME_OVER: "game_over",

};



// ─── Role Assignment ──────────────────────────────────────────────────────────



function assignRoles(playerNames) {

  const count = playerNames.length;

  const roles = [];



  const mafiaCount = count <= 5 ? 1 : count <= 8 ? 2 : 3;

  for (let i = 0; i < mafiaCount; i++) roles.push(ROLES.MAFIA);

  if (count >= 5) roles.push(ROLES.DETECTIVE);

  if (count >= 6) roles.push(ROLES.DOCTOR);

  while (roles.length < count) roles.push(ROLES.VILLAGER);



  // Fisher-Yates shuffle

  const shuffled = [...roles];

  for (let i = shuffled.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

  }



  return playerNames.map((name, i) => ({

    id: i,

    name,

    role: shuffled[i],

    alive: true,

    protected: false,

  }));

}



// ─── Game Logic ───────────────────────────────────────────────────────────────



function checkWinner(players) {

  const alive = players.filter((p) => p.alive);

  const aliveMafia = alive.filter((p) => p.role === ROLES.MAFIA);

  const aliveVillage = alive.filter((p) => p.role !== ROLES.MAFIA);

  if (aliveMafia.length === 0) return "village";

  if (aliveMafia.length >= aliveVillage.length) return "mafia";

  return null;

}



// ─── Components ───────────────────────────────────────────────────────────────



const styles = `

  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');



  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }



  body {

    background: #0d0d0f;

    color: #c9bfad;

    font-family: 'Crimson Pro', Georgia, serif;

    min-height: 100vh;

  }



  .app {

    min-height: 100vh;

    background: 

      radial-gradient(ellipse at 20% 50%, rgba(139,0,0,0.07) 0%, transparent 50%),

      radial-gradient(ellipse at 80% 20%, rgba(180,130,50,0.04) 0%, transparent 40%),

      #0d0d0f;

    display: flex;

    flex-direction: column;

    align-items: center;

    padding: 2rem 1rem;

  }



  .grain {

    position: fixed;

    inset: 0;

    pointer-events: none;

    opacity: 0.035;

    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

    background-size: 200px;

    z-index: 9999;

  }



  h1.title {

    font-family: 'Cinzel Decorative', serif;

    font-size: clamp(2rem, 6vw, 3.5rem);

    color: #c0392b;

    text-shadow: 0 0 40px rgba(192,57,43,0.4), 0 2px 0 #000;

    letter-spacing: 0.05em;

    text-align: center;

    margin-bottom: 0.25rem;

  }



  .subtitle {

    font-style: italic;

    color: #5a5040;

    font-size: 1.1rem;

    text-align: center;

    margin-bottom: 2.5rem;

    letter-spacing: 0.1em;

  }



  .card {

    background: rgba(20,18,14,0.9);

    border: 1px solid rgba(200,180,120,0.12);

    border-radius: 4px;

    padding: 2rem;

    width: 100%;

    max-width: 680px;

    box-shadow: 0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03);

  }



  .card-title {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1.1rem;

    color: #c9a84c;

    margin-bottom: 1.5rem;

    padding-bottom: 0.75rem;

    border-bottom: 1px solid rgba(200,160,60,0.15);

    letter-spacing: 0.08em;

  }



  .input-row {

    display: flex;

    gap: 0.75rem;

    margin-bottom: 1rem;

  }



  input[type="text"] {

    flex: 1;

    background: rgba(255,255,255,0.04);

    border: 1px solid rgba(200,180,120,0.2);

    border-radius: 3px;

    color: #e0d5c0;

    font-family: 'Crimson Pro', serif;

    font-size: 1.1rem;

    padding: 0.6rem 1rem;

    outline: none;

    transition: border-color 0.2s;

  }

  input[type="text"]:focus { border-color: rgba(200,160,60,0.5); }

  input[type="text"]::placeholder { color: #3a342a; }



  button {

    font-family: 'Cinzel Decorative', serif;

    font-size: 0.7rem;

    letter-spacing: 0.1em;

    border: none;

    border-radius: 3px;

    cursor: pointer;

    padding: 0.6rem 1.2rem;

    transition: all 0.2s;

  }



  .btn-primary {

    background: #8b1a1a;

    color: #f0e6c8;

    border: 1px solid #c0392b;

  }

  .btn-primary:hover { background: #a82020; box-shadow: 0 0 20px rgba(192,57,43,0.3); }

  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }



  .btn-ghost {

    background: transparent;

    color: #8a7a5a;

    border: 1px solid rgba(200,180,120,0.2);

  }

  .btn-ghost:hover { color: #c9a84c; border-color: rgba(200,160,60,0.4); }



  .btn-gold {

    background: rgba(180,130,40,0.15);

    color: #c9a84c;

    border: 1px solid rgba(200,160,60,0.35);

  }

  .btn-gold:hover { background: rgba(180,130,40,0.25); }



  .btn-danger {

    background: rgba(139,26,26,0.2);

    color: #e74c3c;

    border: 1px solid rgba(192,57,43,0.3);

  }

  .btn-danger:hover { background: rgba(139,26,26,0.4); }



  .player-chip {

    display: inline-flex;

    align-items: center;

    gap: 0.4rem;

    background: rgba(255,255,255,0.04);

    border: 1px solid rgba(200,180,120,0.15);

    border-radius: 2px;

    padding: 0.3rem 0.6rem;

    margin: 0.25rem;

    font-size: 1rem;

  }

  .player-chip .remove {

    color: #5a3030;

    cursor: pointer;

    font-size: 0.8rem;

    line-height: 1;

    transition: color 0.15s;

  }

  .player-chip .remove:hover { color: #c0392b; }



  .players-list { margin: 1rem 0; }



  .hint {

    font-style: italic;

    color: #4a4030;

    font-size: 0.95rem;

    margin-top: 0.5rem;

  }



  .role-card {

    text-align: center;

    padding: 2rem;

  }



  .role-icon { font-size: 4rem; margin-bottom: 1rem; }



  .role-name {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1.6rem;

    margin-bottom: 0.5rem;

  }



  .role-desc {

    font-style: italic;

    color: #8a7a5a;

    font-size: 1.05rem;

    margin-bottom: 1.5rem;

    line-height: 1.6;

  }



  .reveal-warning {

    background: rgba(139,26,26,0.1);

    border: 1px solid rgba(192,57,43,0.2);

    border-radius: 3px;

    padding: 0.75rem 1rem;

    font-size: 0.9rem;

    color: #8a5050;

    margin-bottom: 1rem;

    text-align: center;

    font-style: italic;

  }



  .phase-header {

    display: flex;

    align-items: center;

    gap: 0.75rem;

    margin-bottom: 1.5rem;

  }



  .phase-icon { font-size: 2rem; }



  .phase-title {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1rem;

    color: #c9a84c;

  }



  .narrator {

    background: rgba(255,255,255,0.02);

    border-left: 2px solid rgba(200,160,60,0.3);

    padding: 1rem 1.2rem;

    margin: 1rem 0;

    font-style: italic;

    color: #9a8a6a;

    line-height: 1.7;

    font-size: 1.05rem;

  }



  .player-select-grid {

    display: grid;

    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));

    gap: 0.5rem;

    margin: 1rem 0;

  }



  .player-select-btn {

    font-family: 'Crimson Pro', serif;

    font-size: 1rem;

    padding: 0.6rem 0.8rem;

    text-align: left;

    background: rgba(255,255,255,0.03);

    border: 1px solid rgba(200,180,120,0.15);

    color: #c9bfad;

    border-radius: 3px;

    cursor: pointer;

    transition: all 0.2s;

    letter-spacing: 0;

  }

  .player-select-btn:hover:not(:disabled) { background: rgba(200,160,60,0.1); border-color: rgba(200,160,60,0.3); color: #e0d5c0; }

  .player-select-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .player-select-btn.selected { background: rgba(139,26,26,0.25); border-color: #c0392b; color: #e88; }

  .player-select-btn.dead { text-decoration: line-through; opacity: 0.3; }



  .result-banner {

    text-align: center;

    padding: 1.5rem;

    border-radius: 3px;

    margin: 1rem 0;

  }

  .result-banner.eliminated {

    background: rgba(139,26,26,0.15);

    border: 1px solid rgba(192,57,43,0.25);

  }

  .result-banner.saved {

    background: rgba(39,174,96,0.1);

    border: 1px solid rgba(39,174,96,0.2);

  }

  .result-banner h3 {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1rem;

    margin-bottom: 0.5rem;

  }



  .vote-tally {

    display: flex;

    flex-direction: column;

    gap: 0.4rem;

    margin: 1rem 0;

  }

  .vote-row {

    display: flex;

    align-items: center;

    gap: 0.5rem;

    font-size: 1rem;

  }

  .vote-bar-bg {

    flex: 1;

    height: 6px;

    background: rgba(255,255,255,0.05);

    border-radius: 3px;

    overflow: hidden;

  }

  .vote-bar {

    height: 100%;

    background: #8b1a1a;

    border-radius: 3px;

    transition: width 0.4s ease;

  }

  .vote-count { font-size: 0.9rem; color: #6a5a4a; min-width: 1.5rem; text-align: right; }



  .players-alive-row {

    display: flex;

    flex-wrap: wrap;

    gap: 0.5rem;

    margin: 1rem 0;

  }



  .player-badge {

    font-family: 'Crimson Pro', serif;

    font-size: 0.95rem;

    padding: 0.2rem 0.6rem;

    border-radius: 2px;

    border: 1px solid rgba(200,180,120,0.15);

    background: rgba(255,255,255,0.03);

    color: #a09080;

  }

  .player-badge.dead { text-decoration: line-through; opacity: 0.3; }



  .gameover-icon { font-size: 5rem; text-align: center; margin-bottom: 1rem; }



  .gameover-title {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1.6rem;

    text-align: center;

    margin-bottom: 0.5rem;

  }



  .role-reveal-list { margin: 1rem 0; }

  .role-reveal-item {

    display: flex;

    align-items: center;

    gap: 0.75rem;

    padding: 0.6rem 0.8rem;

    border-bottom: 1px solid rgba(255,255,255,0.04);

    font-size: 1.05rem;

  }

  .role-reveal-item .player-name { flex: 1; color: #c9bfad; }

  .role-reveal-item .role-tag { font-size: 0.85rem; font-style: italic; }



  .divider {

    border: none;

    border-top: 1px solid rgba(200,180,120,0.1);

    margin: 1.5rem 0;

  }



  .actions-row {

    display: flex;

    gap: 0.75rem;

    flex-wrap: wrap;

    margin-top: 1.5rem;

  }



  .current-player-reveal {

    background: rgba(0,0,0,0.4);

    border: 1px solid rgba(200,180,120,0.15);

    border-radius: 3px;

    padding: 1.5rem;

    text-align: center;

    margin: 1rem 0;

  }

  .current-player-name {

    font-family: 'Cinzel Decorative', serif;

    font-size: 1.1rem;

    color: #c9a84c;

    margin-bottom: 1rem;

  }



  .mafia-list {

    color: #e74c3c;

    font-style: italic;

  }



  .investigation-result {

    background: rgba(243,156,18,0.08);

    border: 1px solid rgba(243,156,18,0.2);

    border-radius: 3px;

    padding: 1rem;

    margin: 1rem 0;

    text-align: center;

  }



  @keyframes fadeIn {

    from { opacity: 0; transform: translateY(8px); }

    to { opacity: 1; transform: translateY(0); }

  }

  .fade-in { animation: fadeIn 0.4s ease forwards; }



  @keyframes flicker {

    0%, 100% { opacity: 1; } 50% { opacity: 0.85; }

  }

  .flicker { animation: flicker 3s ease-in-out infinite; }



  .round-badge {

    font-family: 'Cinzel Decorative', serif;

    font-size: 0.65rem;

    color: #5a5040;

    border: 1px solid rgba(200,180,120,0.1);

    border-radius: 2px;

    padding: 0.2rem 0.5rem;

    letter-spacing: 0.1em;

    margin-bottom: 1.5rem;

  }

`;



// ─── Main App ─────────────────────────────────────────────────────────────────



export default function MafiaGame() {

  const [phase, setPhase] = useState(PHASES.SETUP);

  const [playerNames, setPlayerNames] = useState([]);

  const [inputName, setInputName] = useState("");

  const [players, setPlayers] = useState([]);

  const [revealIndex, setRevealIndex] = useState(0);

  const [revealed, setRevealed] = useState(false);

  const [round, setRound] = useState(1);



  // Night state

  const [mafiaTarget, setMafiaTarget] = useState(null);

  const [doctorTarget, setDoctorTarget] = useState(null);

  const [detectiveTarget, setDetectiveTarget] = useState(null);

  const [detectiveResult, setDetectiveResult] = useState(null);

  const [nightSummary, setNightSummary] = useState(null);



  // Day state

  const [votes, setVotes] = useState({});

  const [voteTarget, setVoteTarget] = useState(null);

  const [hasVoted, setHasVoted] = useState(false);

  const [winner, setWinner] = useState(null);

  const [eliminatedToday, setEliminatedToday] = useState(null);



  // Derived

  const alivePlayers = players.filter((p) => p.alive);

  const aliveMafia = players.filter((p) => p.alive && p.role === ROLES.MAFIA);

  const hasDetective = players.some((p) => p.alive && p.role === ROLES.DETECTIVE);

  const hasDoctor = players.some((p) => p.alive && p.role === ROLES.DOCTOR);



  const addPlayer = () => {

    const name = inputName.trim();

    if (!name || playerNames.includes(name) || playerNames.length >= 15) return;

    setPlayerNames((prev) => [...prev, name]);

    setInputName("");

  };



  const removePlayer = (name) => setPlayerNames((prev) => prev.filter((n) => n !== name));



  const startGame = () => {

    const assigned = assignRoles(playerNames);

    setPlayers(assigned);

    setRevealIndex(0);

    setRevealed(false);

    setRound(1);

    setPhase(PHASES.ROLE_REVEAL);

  };



  const nextReveal = () => {

    if (!revealed) { setRevealed(true); return; }

    if (revealIndex < players.length - 1) {

      setRevealIndex((i) => i + 1);

      setRevealed(false);

    } else {

      setPhase(PHASES.NIGHT_INTRO);

    }

  };



  const startNight = () => {

    setMafiaTarget(null);

    setDoctorTarget(null);

    setDetectiveTarget(null);

    setDetectiveResult(null);

    setPhase(PHASES.NIGHT_MAFIA);

  };



  const confirmMafiaKill = () => {

    if (!mafiaTarget) return;

    if (hasDetective) setPhase(PHASES.NIGHT_DETECTIVE);

    else if (hasDoctor) setPhase(PHASES.NIGHT_DOCTOR);

    else resolveNight(mafiaTarget, null, null);

  };



  const confirmDetective = () => {

    if (!detectiveTarget) return;

    const target = players.find((p) => p.id === detectiveTarget);

    setDetectiveResult(target);

    // Wait for user to acknowledge, then move to doctor or resolve

  };



  const afterDetective = () => {

    if (hasDoctor) setPhase(PHASES.NIGHT_DOCTOR);

    else resolveNight(mafiaTarget, null, detectiveTarget);

  };



  const confirmDoctor = () => {

    if (!doctorTarget) return;

    resolveNight(mafiaTarget, doctorTarget, detectiveTarget);

  };



  const resolveNight = (mafiaKill, doctorSave, detInvestigate) => {

    const saved = mafiaKill !== null && doctorSave === mafiaKill;

    let eliminated = null;

    const updatedPlayers = players.map((p) => {

      if (!saved && p.id === mafiaKill) {

        eliminated = p;

        return { ...p, alive: false };

      }

      return p;

    });

    setPlayers(updatedPlayers);

    setNightSummary({ eliminated, saved, mafiaKill });



    const w = checkWinner(updatedPlayers);

    if (w) { setWinner(w); setPhase(PHASES.GAME_OVER); return; }

    setPhase(PHASES.DAY_ANNOUNCEMENT);

  };



  const startDiscussion = () => {

    setVotes({});

    setVoteTarget(null);

    setHasVoted(false);

    setEliminatedToday(null);

    setPhase(PHASES.DAY_DISCUSSION);

  };



  const castVote = (playerId) => {

    setVotes((prev) => {

      const next = { ...prev };

      next[playerId] = (next[playerId] || 0) + 1;

      return next;

    });

  };



  const executeVote = () => {

    // Find player with most votes

    let maxVotes = 0, targetId = null;

    for (const [id, count] of Object.entries(votes)) {

      if (count > maxVotes) { maxVotes = count; targetId = parseInt(id); }

    }

    if (!targetId) return;



    const updated = players.map((p) => p.id === targetId ? { ...p, alive: false } : p);

    const eliminated = players.find((p) => p.id === targetId);

    setEliminatedToday(eliminated);

    setPlayers(updated);



    const w = checkWinner(updated);

    if (w) { setWinner(w); setPhase(PHASES.GAME_OVER); return; }



    setRound((r) => r + 1);

    setPhase(PHASES.NIGHT_INTRO);

  };



  const resetGame = () => {

    setPhase(PHASES.SETUP);

    setPlayerNames([]);

    setPlayers([]);

    setVotes({});

    setWinner(null);

    setRound(1);

  };



  // ── Render phases ───────────────────────────────────────────────────────────



  const renderPhase = () => {

    switch (phase) {



      case PHASES.SETUP:

        return (

          <div className="card fade-in">

            <div className="card-title">Players</div>

            <div className="input-row">

              <input

                type="text"

                placeholder="Enter player name…"

                value={inputName}

                onChange={(e) => setInputName(e.target.value)}

                onKeyDown={(e) => e.key === "Enter" && addPlayer()}

                maxLength={20}

              />

              <button className="btn-ghost" onClick={addPlayer}>Add</button>

            </div>

            <div className="players-list">

              {playerNames.map((name) => (

                <span key={name} className="player-chip">

                  {name}

                  <span className="remove" onClick={() => removePlayer(name)}>✕</span>

                </span>

              ))}

            </div>

            <p className="hint">

              {playerNames.length < 4

                ? `Add at least ${4 - playerNames.length} more player${4 - playerNames.length !== 1 ? "s" : ""} to begin.`

                : `${playerNames.length} players ready.`}

            </p>

            <div className="actions-row">

              <button className="btn-primary" onClick={startGame} disabled={playerNames.length < 4}>

                Begin Game

              </button>

            </div>

          </div>

        );



      case PHASES.ROLE_REVEAL: {

        const current = players[revealIndex];

        const cfg = ROLE_CONFIG[current.role];

        return (

          <div className="card fade-in">

            <div className="card-title">Role Assignment — {revealIndex + 1} / {players.length}</div>

            <div className="reveal-warning">

              📵 Pass the device to <strong style={{ color: "#c9a84c" }}>{current.name}</strong>. Other players look away.

            </div>

            {!revealed ? (

              <div className="current-player-reveal">

                <div className="current-player-name">{current.name}</div>

                <button className="btn-gold" onClick={() => setRevealed(true)}>Reveal My Role</button>

              </div>

            ) : (

              <div className="role-card fade-in" style={{ borderLeft: `3px solid ${cfg.color}`, marginLeft: 0, paddingLeft: "2rem" }}>

                <div className="role-icon">{cfg.icon}</div>

                <div className="role-name" style={{ color: cfg.color }}>{current.role}</div>

                <div className="role-desc">{cfg.description}</div>

                {current.role === ROLES.MAFIA && (

                  <div className="mafia-list">

                    Your team: {players.filter((p) => p.role === ROLES.MAFIA).map((p) => p.name).join(", ")}

                  </div>

                )}

              </div>

            )}

            {revealed && (

              <div className="actions-row fade-in">

                <button className="btn-primary" onClick={nextReveal}>

                  {revealIndex < players.length - 1 ? "Next Player →" : "All Roles Revealed — Start Game"}

                </button>

              </div>

            )}

          </div>

        );

      }



      case PHASES.NIGHT_INTRO:

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round}</div>

            <div className="phase-header">

              <span className="phase-icon">🌑</span>

              <div className="phase-title">Night Falls</div>

            </div>

            <div className="narrator">

              The village grows silent as night descends. Everyone closes their eyes and the darkness hides many secrets…

            </div>

            <div className="players-alive-row">

              {players.map((p) => (

                <span key={p.id} className={`player-badge ${!p.alive ? "dead" : ""}`}>{p.name}</span>

              ))}

            </div>

            <div className="actions-row">

              <button className="btn-primary" onClick={startNight}>Begin Night Phase</button>

            </div>

          </div>

        );



      case PHASES.NIGHT_MAFIA:

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round} · Night</div>

            <div className="phase-header">

              <span className="phase-icon">🔪</span>

              <div className="phase-title">The Mafia Awakens</div>

            </div>

            <div className="reveal-warning">

              📵 Only Mafia members may view this screen.

            </div>

            <div className="narrator">

              The mafia silently confer and select their target for the night.

              ({aliveMafia.map((m) => m.name).join(", ")})

            </div>

            <p style={{ color: "#8a7a5a", marginBottom: "0.5rem", fontStyle: "italic" }}>Choose your victim:</p>

            <div className="player-select-grid">

              {alivePlayers

                .filter((p) => p.role !== ROLES.MAFIA)

                .map((p) => (

                  <button

                    key={p.id}

                    className={`player-select-btn ${mafiaTarget === p.id ? "selected" : ""}`}

                    onClick={() => setMafiaTarget(p.id)}

                  >

                    {p.name}

                  </button>

                ))}

            </div>

            <div className="actions-row">

              <button className="btn-danger" onClick={confirmMafiaKill} disabled={!mafiaTarget}>

                Confirm Kill

              </button>

            </div>

          </div>

        );



      case PHASES.NIGHT_DETECTIVE:

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round} · Night</div>

            <div className="phase-header">

              <span className="phase-icon">🔍</span>

              <div className="phase-title">Detective Investigates</div>

            </div>

            <div className="reveal-warning">

              📵 Only the Detective may view this screen.

            </div>

            <div className="narrator">

              The detective opens their eyes and silently points to a suspect to investigate.

            </div>

            {!detectiveResult ? (

              <>

                <p style={{ color: "#8a7a5a", marginBottom: "0.5rem", fontStyle: "italic" }}>Investigate who?</p>

                <div className="player-select-grid">

                  {alivePlayers

                    .filter((p) => p.role !== ROLES.DETECTIVE)

                    .map((p) => (

                      <button

                        key={p.id}

                        className={`player-select-btn ${detectiveTarget === p.id ? "selected" : ""}`}

                        onClick={() => setDetectiveTarget(p.id)}

                      >

                        {p.name}

                      </button>

                    ))}

                </div>

                <div className="actions-row">

                  <button className="btn-gold" onClick={confirmDetective} disabled={!detectiveTarget}>

                    Reveal Identity

                  </button>

                </div>

              </>

            ) : (

              <>

                <div className="investigation-result fade-in">

                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{ROLE_CONFIG[detectiveResult.role].icon}</div>

                  <div style={{ color: "#c9a84c", fontStyle: "italic" }}>

                    <strong style={{ color: "#e0d5c0" }}>{detectiveResult.name}</strong> is a{" "}

                    <strong style={{ color: ROLE_CONFIG[detectiveResult.role].color }}>{detectiveResult.role}</strong>.

                  </div>

                </div>

                <div className="actions-row">

                  <button className="btn-gold" onClick={afterDetective}>Close Eyes & Continue</button>

                </div>

              </>

            )}

          </div>

        );



      case PHASES.NIGHT_DOCTOR:

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round} · Night</div>

            <div className="phase-header">

              <span className="phase-icon">💊</span>

              <div className="phase-title">Doctor Chooses</div>

            </div>

            <div className="reveal-warning">

              📵 Only the Doctor may view this screen.

            </div>

            <div className="narrator">

              The doctor opens their eyes and silently points to a player to protect tonight.

            </div>

            <p style={{ color: "#8a7a5a", marginBottom: "0.5rem", fontStyle: "italic" }}>Protect who?</p>

            <div className="player-select-grid">

              {alivePlayers.map((p) => (

                <button

                  key={p.id}

                  className={`player-select-btn ${doctorTarget === p.id ? "selected" : ""}`}

                  onClick={() => setDoctorTarget(p.id)}

                >

                  {p.name}

                </button>

              ))}

            </div>

            <div className="actions-row">

              <button className="btn-gold" onClick={confirmDoctor} disabled={!doctorTarget}>

                Confirm Protection

              </button>

            </div>

          </div>

        );



      case PHASES.DAY_ANNOUNCEMENT: {

        const { eliminated, saved } = nightSummary || {};

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round} · Dawn</div>

            <div className="phase-header">

              <span className="phase-icon">☀️</span>

              <div className="phase-title">The Village Awakens</div>

            </div>

            <div className="narrator">

              Everyone opens their eyes. The village gathers in the square as the truth of the night is revealed…

            </div>

            {saved ? (

              <div className="result-banner saved">

                <h3 style={{ color: "#27ae60" }}>✨ A Miracle!</h3>

                <p>The mafia struck, but the doctor's protection saved someone. <strong>No one was eliminated</strong> tonight.</p>

              </div>

            ) : eliminated ? (

              <div className="result-banner eliminated">

                <h3 style={{ color: "#e74c3c" }}>☠️ A Body is Found</h3>

                <p>

                  <strong style={{ color: "#e0d5c0" }}>{eliminated.name}</strong> was eliminated by the mafia.{" "}

                  They were a <strong style={{ color: ROLE_CONFIG[eliminated.role].color }}>{eliminated.role}</strong>.

                </p>

              </div>

            ) : (

              <div className="result-banner saved">

                <h3 style={{ color: "#8a7a5a" }}>A Quiet Night</h3>

                <p>No one was eliminated.</p>

              </div>

            )}

            <div className="actions-row">

              <button className="btn-primary" onClick={startDiscussion}>Begin Discussion & Voting</button>

            </div>

          </div>

        );

      }



      case PHASES.DAY_DISCUSSION:

      case PHASES.DAY_VOTE: {

        const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

        const maxVotes = Math.max(...Object.values(votes), 0);

        return (

          <div className="card fade-in">

            <div className="round-badge">Round {round} · Day</div>

            <div className="phase-header">

              <span className="phase-icon">⚖️</span>

              <div className="phase-title">Trial & Execution</div>

            </div>

            <div className="narrator">

              The village debates. Accusations fly. Alliances form and fracture. When ready, cast your votes.

            </div>

            <p style={{ color: "#8a7a5a", marginBottom: "0.5rem", fontStyle: "italic" }}>Cast votes (tap a name to vote):</p>

            <div className="player-select-grid">

              {alivePlayers.map((p) => (

                <button key={p.id} className="player-select-btn" onClick={() => castVote(p.id)}>

                  {p.name} {votes[p.id] ? `(${votes[p.id]})` : ""}

                </button>

              ))}

            </div>

            {totalVotes > 0 && (

              <div className="vote-tally">

                {alivePlayers

                  .filter((p) => votes[p.id])

                  .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))

                  .map((p) => (

                    <div key={p.id} className="vote-row">

                      <span style={{ minWidth: "90px", color: "#c9bfad" }}>{p.name}</span>

                      <div className="vote-bar-bg">

                        <div className="vote-bar" style={{ width: `${((votes[p.id] || 0) / maxVotes) * 100}%` }} />

                      </div>

                      <span className="vote-count">{votes[p.id]}</span>

                    </div>

                  ))}

              </div>

            )}

            {eliminatedToday && (

              <div className="result-banner eliminated fade-in">

                <h3 style={{ color: "#e74c3c" }}>☠️ Executed</h3>

                <p>

                  <strong style={{ color: "#e0d5c0" }}>{eliminatedToday.name}</strong> was voted out.

                  They were a <strong style={{ color: ROLE_CONFIG[eliminatedToday.role].color }}>{eliminatedToday.role}</strong>.

                </p>

              </div>

            )}

            <div className="actions-row">

              <button className="btn-danger" onClick={executeVote} disabled={totalVotes === 0}>

                Execute Vote

              </button>

              <button className="btn-ghost" onClick={() => { setRound((r) => r + 1); setPhase(PHASES.NIGHT_INTRO); }}>

                Skip (No Consensus)

              </button>

            </div>

          </div>

        );

      }



      case PHASES.GAME_OVER: {

        const isVillageWin = winner === "village";

        return (

          <div className="card fade-in">

            <div className="gameover-icon">{isVillageWin ? "🏆" : "💀"}</div>

            <div className="gameover-title" style={{ color: isVillageWin ? "#c9a84c" : "#c0392b" }}>

              {isVillageWin ? "Village Victorious!" : "Mafia Wins!"}

            </div>

            <div className="narrator" style={{ textAlign: "center", marginBottom: "1.5rem" }}>

              {isVillageWin

                ? "The last mafia member has been rooted out. Peace returns to the village… for now."

                : "The mafia has taken control. The village falls into darkness."}

            </div>

            <hr className="divider" />

            <div className="card-title" style={{ marginBottom: "1rem" }}>Full Role Reveal</div>

            <div className="role-reveal-list">

              {players.map((p) => {

                const cfg = ROLE_CONFIG[p.role];

                return (

                  <div key={p.id} className="role-reveal-item" style={{ opacity: p.alive ? 1 : 0.5 }}>

                    <span style={{ fontSize: "1.3rem" }}>{cfg.icon}</span>

                    <span className="player-name">{p.name}</span>

                    <span className="role-tag" style={{ color: cfg.color }}>{p.role}</span>

                    {!p.alive && <span style={{ color: "#4a3a3a", fontSize: "0.8rem" }}>✝ eliminated</span>}

                  </div>

                );

              })}

            </div>

            <div className="actions-row" style={{ justifyContent: "center" }}>

              <button className="btn-primary" onClick={resetGame}>Play Again</button>

            </div>

          </div>

        );

      }



      default: return null;

    }

  };



  return (

    <>

      <style>{styles}</style>

      <div className="grain" />

      <div className="app">

        <h1 className="title flicker">La Famiglia</h1>

        <p className="subtitle">— a game of trust and deception —</p>

        {renderPhase()}

      </div>

    </>

  );

}