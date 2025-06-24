# Dynamic Quote Generator

A JavaScript-based web application that dynamically generates and manages quotes using advanced DOM manipulation, web storage, JSON import/export, and server sync simulation.

## 🚀 Features

- ✅ Add and display quotes with category tagging
- ✅ Filter quotes by category using a dropdown
- ✅ Persist data using `localStorage`
- ✅ Import/export quotes in `.json` format
- ✅ Sync with a mock server using `fetch()`
- ✅ Conflict resolution (server data takes precedence)
- ✅ Notification UI for sync status

## 📁 File Structure

.
├── index.html
├── script.js
└── quotes.json (optional sample data)

markdown
Copy
Edit

## 💡 Technologies Used

- Vanilla JavaScript
- HTML5
- Web APIs: DOM, `localStorage`, `FileReader`, `fetch`
- JSONPlaceholder (for server sync simulation)

## 🛠️ Setup & Usage

1. **Download or clone** the repository.
2. Open `index.html` in your browser.
3. Use the interface to:
   - Add new quotes
   - Filter quotes by category
   - Export or import quotes
   - Sync quotes with mock server

## 🔄 Server Sync Simulation

- Fetches data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts)
- Replaces local quotes with the first 5 post titles as `"Synced"` quotes
- Runs automatically every 30 seconds
- Manual sync available via button

## 🧪 Conflict Handling

- If local and server quotes differ, server data overwrites local data
- A notification informs the user when sync or conflicts occur

## ✅ Project Milestones

This project was completed as part of the **ALX Front-End JavaScript** course:

- Milestone 0: DOM manipulation
- Milestone 1: Web Storage & JSON
- Milestone 2: Category Filtering
- Milestone 3: Server Sync & Conflict Resolution

---

## 📸 Screenshots

> *(Add screenshots of UI here if submitting to GitHub)*

---

## 📬 License

This project is part of educational coursework. Feel free to modify and expand it for learning purposes.