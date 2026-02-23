export const ROLES = {
  mafia:     { name: "Mafia",     emoji: "🔪", color: "#e63946", glow: "#e6394660", description: "Eliminate one townsperson each night. Stay hidden." },
  doctor:    { name: "Doctor",    emoji: "💉", color: "#2ecc71", glow: "#2ecc7160", description: "Save one person from death each night. Even yourself." },
  detective: { name: "Detective", emoji: "🕵️", color: "#4cc9f0", glow: "#4cc9f060", description: "Investigate one player each night. Uncover the Mafia." },
  villager:  { name: "Villager",  emoji: "🕯️", color: "#f4a261", glow: "#f4a26160", description: "Find and eliminate the Mafia through discussion and votes." },
};

export const NARRATOR = {
  spoken: {
    nightFalls:     "Night falls over the town. Everyone, close your eyes.",
    eyesClosed:     "Make sure everyone's eyes are closed...",
    mafiaWakes:     "Mafia... open your eyes. Choose your target quietly.",
    doctorWakes:    "Doctor... open your eyes. Choose someone to save tonight.",
    detectiveWakes: "Detective... open your eyes. Choose someone to investigate.",
    allSleep:       "Everyone, close your eyes again. The night is almost over.",
    dayBreaks:      (name) => name ? `Dawn breaks. ${name} was found dead in the night.` : `Dawn breaks. The town slept safely. No one was eliminated.`,
    discuss:        "Discuss among yourselves. Who do you suspect? You have two minutes.",
    voteTime:       "Time to vote. Pass the device to each player.",
    voteReveal:     (name) => name ? `The town has spoken. ${name} has been eliminated.` : `It is a tie. No one was eliminated today.`,
    mafiaWins:      "The Mafia has consumed the town. Darkness prevails.",
    villagersWin:   "The Mafia has been unmasked and defeated. The Villagers win!",
  }
};