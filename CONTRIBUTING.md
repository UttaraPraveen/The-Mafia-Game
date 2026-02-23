# 🤝 Contributing Guide

First of all — thank you for considering contributing to **The Mafia Game**.
This project is designed to be beginner-friendly, creative, and fun to collaborate on. Whether you want to fix a bug, improve UI, or add chaotic narrator personalities — you’re welcome here.

---

## 🌟 Ways You Can Contribute

You don’t have to be an expert developer to help. Contributions of all sizes are appreciated:

* 🐛 Fix bugs or improve performance
* 🎨 Enhance UI/UX or animations
* 🧠 Improve game logic
* ✨ Add new narrator scripts or personalities
* 📖 Improve documentation
* 🧪 Suggest new roles or gameplay features

---

## 🚀 Getting Started

### 🌐 Play the Live Version (Recommended)
The game is already deployed — you can play it instantly without installing anything:

👉 Open the Live App:
https://the-mafia-game-nu.vercel.app/

Simply open the link on your phone or tablet and start playing.

### 1️⃣ Fork the Repository

Click the **Fork** button on GitHub and clone your fork locally.

```bash
git clone https://github.com/your-username/mafia-party-game.git
cd mafia-party-game
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Project Locally

```bash
npm run dev
```

---

## 🌿 Branching Rules

Please create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Examples:

* `feature/new-role-ui`
* `fix/night-phase-bug`
* `docs/update-readme`

Avoid committing directly to `main`.

---

## 🧱 Project Structure Overview

```
src/
├── components/   # UI and screen components
├── hooks/        # Custom hooks (Narrator, timers, etc.)
├── utils/        # Game logic + constants
├── css/          # Global styles and animations
```

### Important Guidelines

* Keep **game logic** inside `/utils`, not inside UI components.
* Components should stay clean and focused on rendering.
* Avoid adding large libraries unless necessary.

---

## 🎨 Code Style

* Use clear and readable variable names.
* Keep components small and reusable.
* Comment complex logic so beginners can understand.
* Prefer functional components and React hooks.

Example:

```js
// GOOD: Logic separated from UI
import { calculateVotes } from "../utils/gameLogic";
```

---

## 🧪 Before Submitting a Pull Request

Please make sure:

* The project runs without errors (`npm run dev`)
* Your changes don’t break existing gameplay
* You tested the flow (Setup → Night → Day → Voting)

---

## 📬 How to Submit a Pull Request

1. Push your branch:

```bash
git push origin feature/your-feature-name
```

2. Open a Pull Request on GitHub.
3. Clearly describe:

   * What you changed
   * Why you changed it
   * Screenshots or videos (if UI related)

---

## 💡 Contribution Ideas (Great for Beginners)

* Add new narrator text styles (sarcastic, dramatic, chaotic)
* Improve particle animations
* Add sound effects toggle
* Improve mobile layout
* Create new role icons

---

## 🧠 Community Guidelines

Be kind, respectful, and constructive.
This project is meant to be a safe space for learning, experimenting, and building cool things together.

---

Thanks again for contributing.
Now go create some chaos — the Mafia is watching. 🔪

