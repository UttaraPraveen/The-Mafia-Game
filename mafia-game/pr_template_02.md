## 📌 Description
This PR addresses Issue #02 by adding validation to the SetupScreen to prevent players from entering duplicate names. This prevents confusion during night actions and voting phases.

---

## 🔗 Related Issue
Closes #02

---

## 🛠 Changes Made
- Added a uniqueness check in `SetupScreen` component (`new Set(playerNames).size !== playerNames.length`).
- Disabled the "BEGIN THE NIGHT" button when duplicated names are detected.
- Added an error message advising players to use unique identifiers when duplicates are present.

---

## 📷 Screenshots (if applicable)

---

## ✅ Checklist
- [x] I have tested my changes
- [x] My code follows project guidelines
- [x] I have linked the related issue
