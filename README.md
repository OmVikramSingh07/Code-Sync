# ⚡ Code-Sync

**Real-time collaborative code editor built for software engineering teams**

Code-Sync combines a high-performance CodeMirror editing engine, low-latency Socket.IO multiplayer synchronization, and instant room management into a single developer-first workspace.

`React 19` `Vite` `Node.js` `Express` `Socket.IO` `CodeMirror` `JavaScript` `CSS3`

---

## 📌 About

Most collaborative editors are heavy, bloated, or require complex authentication setup.

**Code-Sync was built specifically for developers who need instant, frictionless real-time code collaboration.**

The goal was to create a lightweight, responsive system where engineering teams can:
- **Pair program** live with zero setup delay,
- **Conduct technical interviews** in isolated, sync-enabled rooms,
- **Share code snippets** and debug together in real time.

Instead of heavy web clients or complex cloud authentication overhead, Code-Sync provides single-click room generation, efficient Socket.IO event broadcasting, and immediate late-joiner code state synchronization.

---

## 🎨 Features

### ⚡ Real-Time Code Synchronization
Powered by Socket.IO with dynamic state delta tracking.
- Instant character-by-character editing sync across all connected room members.
- Bidirectional event broadcasting with near-zero latency.
- Smart origin filtering to prevent typing lag and edit collisions.

### 👥 Live Peer Presence & Room Management
- Real-time active user roster with dynamic user avatars (`react-avatar`).
- Animated visual pulse indicator for active live sessions.
- Real-time toast notifications (`react-hot-toast`) when peers join or leave rooms.
- Single-click unique Room ID generation powered by `uuid` v4.
- One-click copy-to-clipboard functionality for seamless room invitation.

### 💻 Integrated CodeMirror Editor Surface
- Feature-rich CodeMirror environment with dark Dracula theme syntax highlighting.
- Automatic bracket closing (`closebrackets`) and tag closing (`closetag`).
- Full line numbering, line wrapping, tab formatting, and smooth scrolling.

### 🔄 Late-Joiner Code State Sync
- Automated code catch-up protocol (`SYNC_CODE`).
- When a new developer joins an ongoing room, existing active peers automatically transmit the current editor buffer state to ensure immediate room-wide code parity.

---

## 🧠 Killer Feature Spotlight — Low-Latency Socket.IO Protocol

Code-Sync utilizes an event-driven architecture designed specifically for low-latency code collaboration without server-side database bottlenecks.

### Synchronization Workflow

```
[ Developer A Types ] 
        │
        ▼
[ CodeMirror Change Event ]
        │ (Filter 'setValue' origins)
        ▼
[ Socket.IO Emit 'code-change' ]
        │
        ▼
[ Express / Socket.IO Server ]
        │ (Broadcast to Room)
        ▼
[ Developer B Receives ] ────► [ CodeMirror Updated ]
```

1. **User Input Detection**: CodeMirror captures input changes (`origin !== 'setValue'`).
2. **Event Dispatch**: Client fires `ACTIONS.CODE_CHANGE` with the updated code string and target `roomId`.
3. **Server Relay**: Express/Socket.IO server broadcasts the payload to all room sockets except the sender socket.
4. **State Reconciliation**: Receiver checks buffer equality and updates CodeMirror seamlessly without losing cursor focus.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Browser                            │
│  ┌───────────────────────────────┐  ┌────────────────────────┐  │
│  │   React 19 + React Router     │  │   CodeMirror 5 Editor   │  │
│  └───────────────┬───────────────┘  └───────────┬────────────┘  │
│                  │                              │               │
│                  └───►  Socket.IO Client  ◄─────┘               │
└──────────────────────────────┬──────────────────────────────────┘
                               │ (WebSocket Protocol)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Node.js Backend                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Express 5 Web Server                    │  │
│  └───────────────┬───────────────────────────────────────────┘  │
│                  │                                              │
│  ┌───────────────┴───────────────────────────────────────────┐  │
│  │                Socket.IO Collaboration Server             │  │
│  │  • Room Adapters   • userSocketMap   • Event Dispatcher   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧱 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite | Fast UI rendering and hot-module replacement |
| **Routing** | React Router DOM v7 | Dynamic client-side room routing (`/editor/:roomId`) |
| **Code Editor Engine** | CodeMirror 5 | High-performance text editor surface with auto-close addons |
| **Realtime Layer** | Socket.IO (Client & Server v4) | Low-latency WebSockets collaboration layer |
| **Backend API Server** | Express.js 5 / Node.js | HTTP static server & Socket server host |
| **UI Notifications** | React Hot Toast | Real-time connection status and peer join/leave toasts |
| **Avatars & Styling** | React Avatar, Custom CSS | Modern clean UI design with orange accents |
| **Utilities** | UUID v4 | Cryptographically secure unique room generation |

---

## 🚧 Technical Challenges Overcome

### 1. Loop-Free Code Mirror State Synchronization
- **Challenge**: Directly binding CodeMirror change events to socket emissions can cause infinite echo loops when receiving remote code updates.
- **Solution**: Implemented change origin filtering (`origin !== 'setValue'`) and conditional value comparison before calling `setValue()`. This ensures locally initiated edits trigger socket broadcasts while remote edits update the view cleanly without triggering secondary outgoing emissions.

### 2. Zero-Database Late-Joiner Code State Catch-Up
- **Challenge**: When a new client joins an established session, the server doesn't persist editor state in a database, leaving the new user with a blank editor.
- **Solution**: Developed a peer-assisted state sync protocol (`ACTIONS.SYNC_CODE`). Upon receiving a `JOINED` event, existing room participants automatically send their active editor buffer directly to the newly joined `socketId`.

### 3. React 19 Lifecycle & Connection Safety
- **Challenge**: Dual mounting in React single-page components can result in duplicated socket connections and dangling event listeners.
- **Solution**: Architected a robust cleanup pipeline inside `useEffect` using `isSubscribed` state flags, explicit `socket.off()` event detaching, and clean socket disconnection on component unmount.

### 4. Client Peer List Deduplication
- **Challenge**: Multiple rapid socket reconnects or room sync events could result in duplicate peer cards rendering in the sidebar.
- **Solution**: Built an in-memory client array deduplicator filtering by `socketId` in `EditorPage`, guaranteeing clean avatar rendering across all network events.

---

## 📂 Project Structure

```
Code-Sync/
 ├── server.js             # Express & Socket.IO backend server
 ├── index.html            # HTML layout entry point
 ├── vite.config.js        # Vite bundler configuration
 ├── package.json          # Package manifest & scripts
 ├── public/               # Static public assets
 └── src/
      ├── Actions.js        # Socket event dictionary
      ├── socket.js         # Socket.IO client connector
      ├── App.jsx           # App routes & toast provider
      ├── App.css           # Custom CSS design system
      ├── components/
      │    ├── Client.jsx    # User peer avatar component
      │    └── Editor.jsx    # CodeMirror component integration
      └── pages/
           ├── HomePage.jsx  # Room join & generation page
           └── EditorPage.jsx# Collaborative editor workspace
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/code-sync.git
cd code-sync
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Optional)
Create a `.env` file in the root folder if a custom port or backend host is needed:
```env
VITE_BACKEND_URL=http://localhost:5000
PORT=5000
```

### 4. Run Development Servers

**Start Node.js Backend Server:**
```bash
npm run server:dev
```

**Start Vite React Frontend (in a separate terminal):**
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🚀 Production Deployment & Build

### 1. Build Frontend Assets
```bash
npm run build
```
This compiles the optimized production build into the `/dist` directory.

### 2. Run Single Server Production Mode
```bash
npm run server:dev
```
The Express server automatically serves the compiled `/dist` frontend bundles and handles Socket.IO connections concurrently on port `5000`.

---

## 🧪 Future Roadmap

- 📝 **Multi-Language Syntax Selector**: Dynamic syntax mode switching (Python, C++, Java, HTML/CSS).
- 🔒 **Password Protected Rooms**: Secure room entry with optional access passcodes.
- 💬 **Integrated In-Room Chat**: Text chat sidebar alongside peer list.
- 💾 **Local File Export & Download**: One-click download of edited code files.
- 🎨 **Custom Theme Switcher**: Toggle between Dracula, Monokai, Solarized, and Light themes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to open an issue or submit a pull request if you'd like to improve Code-Sync.

---

## 📜 License

MIT License © 2026 Code-Sync

*Built for engineers who collaborate in real time.*
