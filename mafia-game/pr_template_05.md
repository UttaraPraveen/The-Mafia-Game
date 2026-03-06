## 📌 Description
This PR addresses Issue #05 by implementing a Game Log / Graveyard feature. It tracks eliminated players and their roles, and makes this information accessible via a toggleable modal during the Day and Voting phases.

---

## 🔗 Related Issue
Closes #05

---

## 🛠 Changes Made
- Added an `eventLogs` array to the `gameState` in `App.jsx` to keep a history of eliminations (who died, their role, phase, and round).
- Created a `GameLogModal` component in `UI.jsx` that presents the list of victims in a styled drawer overlay.
- Integrated a Game Log button (📜) in `DayPhaseScreen` and `VotingPhaseScreen` in `GameScreens.jsx` to easily refer back to past eliminations during discussion and voting.

---

## 📷 Screenshots (if applicable)

---

## ✅ Checklist
- [x] I have tested my changes
- [x] My code follows project guidelines
- [x] I have linked the related issue
