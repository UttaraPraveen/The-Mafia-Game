import React, { useState } from "react";
import "./css/global.css";
import { useNarrator } from "./hooks/useNarrator";
import { assignRoles, resolveNight, resolveVotes, checkWinCondition } from "./utils/gameLogic";
import { SetupScreen, RoleRevealScreen, NightPhaseScreen, DayPhaseScreen, VotingPhaseScreen, ResultScreen, GameOverScreen } from "./components/GameScreens";

export default function App() {
  const [gameState, setGameState] = useState({
    phase: "setup", players: [], round: 1, nightActions: {},
    eliminated: null, winner: null, revealIndex: 0, tie: false,
  });

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak, stop } = useNarrator(voiceEnabled);

  const hasDoctor    = gameState.players.some((p) => p.role === "doctor");
  const hasDetective = gameState.players.some((p) => p.role === "detective");

  // State Transitions
  function handleGameStart(playerNames, roleCounts) {
    const players = assignRoles(playerNames, roleCounts);
    setGameState({ phase: "roleReveal", players, round: 1, nightActions: {}, eliminated: null, winner: null, revealIndex: 0, tie: false });
  }

  function handleNightComplete(nightActions) {
    const { updatedPlayers, eliminated } = resolveNight(gameState.players, nightActions);
    const winner = checkWinCondition(updatedPlayers);
    if (winner) {
      setGameState((s) => ({ ...s, players: updatedPlayers, eliminated, winner, phase: "gameOver" }));
    } else {
      setGameState((s) => ({ ...s, phase: "day", players: updatedPlayers, eliminated, nightActions }));
    }
  }

  function handleVotingComplete(votes) {
    const { updatedPlayers, eliminated, tie } = resolveVotes(gameState.players, votes);
    const winner = checkWinCondition(updatedPlayers);
    if (winner) {
      setGameState((s) => ({ ...s, players: updatedPlayers, eliminated, winner, phase: "gameOver" }));
    } else {
      setGameState((s) => ({ ...s, phase: "result", players: updatedPlayers, eliminated, tie }));
    }
  }

  function handleRestart() {
    setGameState({ phase: "setup", players: [], round: 1, nightActions: {}, eliminated: null, winner: null, revealIndex: 0, tie: false });
  }

  // Render Phase
  const { phase } = gameState;

  return (
    <>
      {phase !== "setup" && (
        <button onClick={() => { setVoiceEnabled((v) => !v); stop(); }} title={voiceEnabled ? "Mute" : "Unmute"}
          style={{ position: "fixed", top: 16, right: 16, zIndex: 999, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: voiceEnabled ? "var(--accent-gold)" : "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}>
          {voiceEnabled ? "🔊" : "🔇"}
        </button>
      )}

      {phase === "setup" && <SetupScreen onStart={handleGameStart} />}
      {phase === "roleReveal" && (
        <RoleRevealScreen players={gameState.players} revealIndex={gameState.revealIndex}
          onRevealNext={() => setGameState((s) => ({ ...s, revealIndex: s.revealIndex + 1 }))}
          onAllRevealed={() => setGameState((s) => ({ ...s, phase: "night" }))} speak={speak} />
      )}
      {phase === "night" && <NightPhaseScreen players={gameState.players} round={gameState.round} hasDoctor={hasDoctor} hasDetective={hasDetective} onNightComplete={handleNightComplete} speak={speak} stop={stop} />}
      {phase === "day" && <DayPhaseScreen eliminated={gameState.eliminated} round={gameState.round} onDiscussionEnd={() => setGameState((s) => ({ ...s, phase: "voting" }))} speak={speak} />}
      {phase === "voting" && <VotingPhaseScreen players={gameState.players} onVotingComplete={handleVotingComplete} speak={speak} />}
      {phase === "result" && <ResultScreen eliminated={gameState.eliminated} tie={gameState.tie} onContinue={() => setGameState((s) => ({ ...s, phase: "night", round: s.round + 1, eliminated: null, nightActions: {} }))} speak={speak} />}
      {phase === "gameOver" && <GameOverScreen winner={gameState.winner} players={gameState.players} onRestart={handleRestart} speak={speak} />}
    </>
  );
}