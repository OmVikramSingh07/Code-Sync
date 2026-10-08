# ⚡ Code-Sync

**Real-time collaborative code editor built for software engineering teams**

Code-Sync is a high-performance, developer-first workspace that combines a **CodeMirror** text editor engine, low-latency **Socket.IO** multiplayer synchronization, and instant room management into a seamless pair programming platform.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.0-000000?logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socketdotio&logoColor=white)
![CodeMirror](https://img.shields.io/badge/CodeMirror-5.65-D70000?logo=codemirror&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📌 Project Overview

**Code-Sync** was created to eliminate the setup friction involved in live developer collaboration. Whether conducting technical interviews, pair programming on complex modules, or debugging code snippets in real time, Code-Sync provides instant, isolated collaborative rooms without requiring user sign-ups or heavy cloud overhead.

### Key Highlights
- **Zero-Delay Room Creation**: Generate cryptographically secure unique room links with one click.
- **Bi-directional Live Sync**: Character-by-character real-time code editor synchronization.
- **Zero-Database Buffer Catch-up**: Late-joining developers instantly receive the current editor buffer state from active peers.
- **Theme Switching**: Seamless toggle between Light (Bright) and Dark mode interfaces.
- **Live Peer Roster**: Interactive sidebar displaying active online users, animated status indicators, and user avatars.

---

## 🎨 Core Features

### ⚡ Real-Time Code Synchronization
- Powered by Socket.IO WebSocket protocols.
- Low-latency event relay ensures remote keystrokes render smoothly.
- Infinite echo prevention ensures local keystrokes fire change events without re-triggering remote updates.

### 🌓 Dual Theme Support (Bright & Dark Mode)
- Built-in theme manager persisted in browser `localStorage`.
- Tailored color palettes for both editor and workspace background cards.
- Integrated CodeMirror Dracula theme syntax highlighting.

### 👥 Live Peer Presence & Roster
- Dynamic user avatars powered by `react-avatar`.
- Active online user counter badge.
- Real-time notification toasts via `react-hot-toast` on peer join and leave events.
- In-memory socket ID deduplication to prevent ghost user listings.

### 💻 CodeMirror 5 Integration
- High-performance JavaScript/JSON editing surface.
- Auto-closing tags and auto-closing brackets.
- Line numbering, line wrapping, custom tab sizing, and smooth scrolling.

### 📋 One-Click Share & Room Copy
- Built-in `uuid` v4 generator for unique session IDs.
- One-click copy Room ID button with instant toast confirmation.

---

## 📁 Project Structure

```
Code-Sync/
├── .env                       # Environment variables configuration
├── .gitignore                 # Git ignore specifications
├── eslint.config.js            # ESLint flat configuration
├── index.html                 # Main HTML entry point & font links
├── package.json               # Dependencies and build scripts
├── package-lock.json          # Node package manager lockfile
├── README.md                  # Detailed Project Documentation
├── server.js                  # Express & Socket.IO backend server
├── vite.config.js             # Vite bundler configuration
├── public/                    # Static public directory
└── src/                       # React frontend source code
    ├── Actions.js             # Socket event constants dictionary
    ├── App.css                # Custom CSS design system & themes
    ├── App.jsx                # Application router & toast container
    ├── index.css              # Global styles & root resets
    ├── main.jsx               # React DOM mounting entry point
    ├── socket.js              # Socket.IO client initialization logic
    ├── assets/                # Branding images & logos
    │   └── Code-Sync.png      # Application logo
    ├── components/            # Modular React components
    │   ├── Client.jsx         # User peer avatar component card
    │   └── Editor.jsx         # CodeMirror editor wrapper & socket listener
    └── pages/                 # Routing page views
        ├── HomePage.jsx       # Room join & creation landing page
        └── EditorPage.jsx     # Real-time collaborative editor workspace
```

---

## 🏗️ Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Browser                                │
│  ┌──────────────────────────────┐     ┌─────────────────────────────┐  │
│  │   React 19 + React Router    │     │    CodeMirror 5 Editor      │  │
│  └──────────────┬───────────────┘     └──────────────┬──────────────┘  │
│                 │                                    │                 │
│                 └───────────► Socket.IO Client ◄─────┘                 │
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │ (WebSocket / Polling)
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Node.js Backend                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Express 5 Web Server                          │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────┴───────────────────────────────┐  │
│  │               Socket.IO Collaboration Server                     │  │
│  │   • Room Adapter   • userSocketMap Map   • Event Dispatcher      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Event Lifecycle & Synchronization Flow

1. **User Types**: Input captured by CodeMirror `change` handler (`origin !== 'setValue'`).
2. **Emit Event**: Client dispatches `code-change` event with target `roomId` and code content.
3. **Server Relay**: Socket.IO server broadcasts `code-change` payload to all other clients connected to `roomId`.
4. **State Update**: Remote clients inspect code difference and update CodeMirror view safely using `setValue(code)`.
5. **Peer Catch-Up**: On new user join (`join`), active clients emit `sync-code` to deliver the live code buffer directly to the newly joined `socketId`.

---

## 🔌 Socket Events Reference

| Event Name | Direction | Payload | Purpose |
| :--- | :--- | :--- | :--- |
| `join` | Client ➔ Server | `{ roomId, username }` | Registers user socket in a specific room channel |
| `joined` | Server ➔ Client | `{ clients, username, socketId }` | Emitted to room when a new peer connects |
| `code-change` | Client ↔ Server | `{ roomId, code }` / `{ code }` | Relays live code editor updates to peers |
| `sync-code` | Client ➔ Server ➔ Client | `{ socketId, code }` | Transfers active code buffer to a newly joined peer |
| `disconnected` | Server ➔ Client | `{ socketId, username }` | Notifies remaining room members when a peer leaves |
| `leave` | Client ➔ Server | `{ roomId }` | Explicit room exit notification |

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **React 19**: Modern UI rendering and component state management.
- **Vite 8**: Next-generation lightning-fast frontend tooling and HMR.
- **React Router DOM 7**: Single-page application room routing (`/editor/:roomId`).
- **CodeMirror 5**: Performant text editing engine with auto-close extensions.
- **React Avatar**: Dynamic user avatar generation from names.
- **React Hot Toast**: Crisp status and event notifications.

### Backend
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js 5**: Web application framework serving production static assets.
- **Socket.IO 4**: Low-latency bidirectional event-based communication.

### Utilities
- **UUID v4**: Cryptographically secure unique room generation.

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/OmVikramSingh07/codesync.git
cd codesync/Code-Sync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env` file inside the `Code-Sync` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
PORT=5000
```

### 4. Run Development Mode

**Start Backend Server:**
```bash
npm run server:dev
```

**Start Vite Frontend Server (in a new terminal):**
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 🚀 Production Build & Deployment

### 1. Build Production Frontend
```bash
npm run build
```
This bundles static React assets into the `dist` folder.

### 2. Launch Production Server
```bash
npm run server:dev
```
The Express server will automatically serve the built static assets from `dist/` and handle Socket.IO connections concurrently on port `5000`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the repository and open a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

*Built with ❤️ for real-time developer collaboration.*
