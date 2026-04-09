# 📝 inkpad — Offline-First Markdown Note-Taking App

> A distraction-free, highly performant note-taking application designed for developers and students, capable of working entirely offline.

---

## 📌 Project Overview

**inkpad** is a lightweight alternative to Notion/Obsidian built with React. It features a real-time Markdown editor with live preview, full offline support using IndexedDB and Service Workers, and auto-save on every keystroke — so you never lose your work.

---

## ✨ Features

- 📄 **Real-time Markdown Preview** — Split / Edit / Preview modes
- 💾 **Offline-First Architecture** — Works without internet using IndexedDB + Service Worker
- ⚡ **Auto-Save** — Debounced save every 800ms, persists across sessions and tab closes
- 🎨 **Syntax Highlighting** — Code blocks highlighted via highlight.js
- 🏷️ **Auto Tag Extraction** — Write `#tagname` anywhere to auto-tag notes
- 📌 **Pin Notes** — Pin important notes to the top
- 🌙 **Dark / Light Mode** — Persisted to localStorage
- 📤 **Export** — Download any note as a `.md` file
- ✅ **Task Lists** — Interactive checkboxes with `- [ ]` syntax
- ⌨️ **Smart Editor** — Auto-continues lists, blockquotes; Tab indents; keyboard shortcuts

---

## ⌨️ Keyboard Shortcuts

| Action        | Shortcut   |
|---------------|------------|
| Bold          | Ctrl + B   |
| Italic        | Ctrl + I   |
| Link          | Ctrl + K   |
| Tab Indent    | Tab        |
| New List Item | Enter      |

---

## 🛠️ Tech Stack

| Technology         | Purpose                         |
|--------------------|---------------------------------|
| React 18           | UI Framework                    |
| Vite               | Build Tool and Dev Server       |
| Tailwind CSS v3    | Styling                         |
| marked v17         | Markdown to HTML Parser         |
| highlight.js       | Code Syntax Highlighting        |
| IndexedDB (native) | Offline Note Storage            |
| Service Worker     | Offline Caching and PWA Support |
| lucide-react       | Icons                           |

---

## 📁 Project Structure

```
inkpad/
├── public/
│   └── sw.js                        # Service Worker (offline caching)
│
├── src/
│   ├── App.jsx                      # Root layout, online/offline detection
│   ├── main.jsx                     # Entry point + Service Worker registration
│   ├── index.css                    # Tailwind base + global styles
│   │
│   ├── components/
│   │   ├── Sidebar.jsx              # Note list, search, tag filter, actions
│   │   ├── Toolbar.jsx              # Markdown formatting toolbar
│   │   ├── Editor.jsx               # Smart textarea with keyboard handling
│   │   ├── Preview.jsx              # Live rendered HTML preview
│   │   ├── StatusBar.jsx            # Save status, word/char/line count
│   │   ├── EmptyState.jsx           # Welcome screen with cheatsheet
│   │   └── ErrorBoundary.jsx        # Catches runtime errors gracefully
│   │
│   ├── hooks/
│   │   ├── useNotes.js              # Note state + 800ms debounced autosave
│   │   └── useTheme.js              # Dark/light mode with localStorage
│   │
│   ├── services/
│   │   └── db.js                    # IndexedDB CRUD operations
│   │
│   └── utils/
│       └── markdown.js              # Marked parser + tag/word extractors
│
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher (LTS recommended) — download from nodejs.org
- npm (comes with Node.js)

### Installation and Run

```bash
# 1. Unzip the project
unzip inkpad-notes-app.zip
cd markdown-notes

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Then open your browser and visit: http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗄️ How Offline Works

1. IndexedDB stores all notes directly in the browser — no server needed
2. Service Worker caches app assets on first load
3. On subsequent visits, the app loads from cache even with no internet
4. Every keystroke is auto-saved within 800ms to IndexedDB
5. An offline indicator appears when network is lost — notes keep saving locally

---

## 👥 Team Members
 TEAM NAME: CODEX
 1. ABIR DAS (LEADER)
 2. JASKARAN SINGH
 3. MALAY GIRI
 4. RAHUL SINGH
 5. BHUKYA SANKSHITHA

---

## 📄 License

This project is built for educational purposes.

---

> "The best tool is the one that gets out of your way."