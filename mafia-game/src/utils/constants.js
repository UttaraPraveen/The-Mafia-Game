// src/utils/constants.js

export const ROLES = {
  mafia:     { name: "Mafia",     emoji: "🔪", color: "#c0392b", description: "Kill one villager each night. Stay hidden." },
  doctor:    { name: "Doctor",    emoji: "💊", color: "#27ae60", description: "Save one person each night, including yourself." },
  detective: { name: "Detective", emoji: "🔍", color: "#2980b9", description: "Investigate one player each night. Learn if they're Mafia." },
  villager:  { name: "Villager",  emoji: "🏘️", color: "#f39c12", description: "Find and eliminate the Mafia through discussion and voting." },
};

export const NARRATOR = {
  nightFalls:       "🌙 Night falls over the town…\nEveryone close your eyes.",
  mafiaWakes:       "🔪 Mafia, open your eyes.\nChoose your target quietly.",
  doctorWakes:      "💊 Doctor, open your eyes.\nChoose someone to save tonight.",
  detectiveWakes:   "🔍 Detective, open your eyes.\nChoose someone to investigate.",
  allSleep:         "😴 Everyone close your eyes again.\nThe night is almost over.",
  dayBreaks:        (name) => name ? `☀️ Dawn breaks…\n${name} was found dead.` : `☀️ Dawn breaks…\nThe town slept safely. No one was eliminated!`,
  discuss:          "💬 Discuss among yourselves.\nWho do you suspect?",
  voteTime:         "🗳️ Time to vote!\nPass the device to each player.",
  voteReveal:       (name) => name ? `The town has spoken.\n${name} has been eliminated.` : `It's a tie! No one was eliminated today.`,
  mafiaWins:        "🔪 The Mafia has taken over the town.\nVillagers have lost.",
  villagersWin:     "🎉 The Mafia has been defeated!\nThe Villagers win!",

  spoken: {
    nightFalls:     "Night falls over the town. Everyone, close your eyes.",
    mafiaWakes:     "Mafia... open your eyes. Choose your target quietly.",
    doctorWakes:    "Doctor... open your eyes. Choose someone to save tonight.",
    detectiveWakes: "Detective... open your eyes. Choose someone to investigate.",
    allSleep:       "Everyone, close your eyes again. The night is almost over.",
    dayBreaks:      (name) => name ? `Dawn breaks. ${name} was found dead in the night.` : `Dawn breaks. The town slept safely. No one was eliminated.`,
    discuss:        "Discuss among yourselves. Who do you suspect?",
    voteTime:       "Time to vote. Pass the device to each player.",
    voteReveal:     (name) => name ? `The town has spoken. ${name} has been eliminated.` : `It is a tie. No one was eliminated today.`,
    mafiaWins:      "The Mafia has taken over the town. Villagers have lost.",
    villagersWin:   "The Mafia has been defeated! The Villagers win!",
  },
};