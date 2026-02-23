# 🎭 Mafia — Immersive Party Game

A cinematic, web-based adaptation of the classic social deduction game **Mafia**. Designed for pass-and-play on a single device, this app features a neo-noir aesthetic, atmospheric particle effects, and a built-in **Voice Narrator** to guide players through the night — eliminating the need for a human moderator.

---

## 🎮 How to Play

### 1. Setup
Enter the number of players and select the number of mafias to include.

### 2. Role Reveal
Pass the device around. Each player taps to see their role secretly.

### 3. Night Phase
The Narrator guides the game. Pass the device to the specific roles called (Mafia, Doctor, Detective) to perform their secret actions.

### 4. Day Phase
The results of the night are revealed. Players discuss who they suspect.

### 5. Voting
Players vote to eliminate a suspect.

### 6. Repeat
The cycle continnues until:
- Mafia outnumber the Town (Mafia Win)
- All Mafia are eliminated (Town Win)
---

## ✨ Features

### 🎮 Pass-and-Play Gameplay
Designed for **5–15 players** using a single phone or tablet.

### 🗣️ Auto-Narrator
Uses the **Web Speech API** to narrate game phases:

> "Night falls..."  
> "Mafia, wake up..."

No dedicated moderator required — everyone gets to play.

### 🖤 Immersive UI
- Neo-noir aesthetic with **blood & gold** color themes  
- Particle systems (embers / ash effects)  
- Smooth animations and cinematic transitions  

### ⚙️ Game Logic Engine
Automatically handles:
- Role randomization *(Fisher–Yates shuffle)*
- Night action resolution *(Mafia kills vs Doctor saves)*
- Win condition checks

### 🎭 Roles Included
- 🔪 **Mafia** — Eliminate the town  
- 💉 **Doctor** — Save one person per night  
- 🕵️ **Detective** — Investigate roles  
- 🕯️ **Villager** — Vote out the imposters  

---

## 🛠️ Tech Stack

- **Framework:** React  
- **Build Tool:** Vite  
- **Styling:** Pure CSS (CSS Variables + Keyframe Animations)  
- **Audio:** Web Speech API (Native Browser Text-to-Speech)

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js (Version 16 or higher recommended)  
- npm (comes with Node.js)

### 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/mafia-party-game.git
cd mafia-party-game
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the game:

The terminal will show a local URL (usually http://localhost:5173).

---

## 📂 Project Structure

This project follows a modular structure to separate logic, UI, and state management.

src/
├── components/
│   ├── GameScreens.jsx    # All phase-specific screens (Setup, Night, Day, Voting)
│   └── UI.jsx             # Reusable UI elements (Buttons, ParticleCanvas, Timer)
├── css/
│   └── global.css         # Global variables, fonts, and animations
├── hooks/
│   └── useNarrator.js     # Custom hook for Text-to-Speech logic
├── utils/
│   ├── constants.js       # Game configuration (Role details, Narrator scripts)
│   └── gameLogic.js       # Pure functions for game rules (Shuffling, Voting math)
├── App.jsx                # Main State Machine (Controls game flow)
└── main.jsx               # Entry point

---

## 📄 License
This project is open-source and available under the MIT License.

---
Built with React & Vite.
Don’t trust anyone. 🕵️‍♂️
