import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Client from '../components/Client';
import Editor from '../components/Editor';
import ACTIONS from '../Actions';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import logo from '../assets/Code-Sync.png';

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const codeRef = useRef(null);

  function copyRoomId() {
    try {
      navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    } catch (err) {
      toast.error("Couldn't copy Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  useEffect(() => {
    let isSubscribed = true;
    let socketInstance = null;

    const init = async () => {
      const socket = await initSocket();
      socketInstance = socket;

      if (!isSubscribed) {
        socket.disconnect();
        return;
      }

      socketRef.current = socket;
      setSocketReady(true);

      socket.on('connect_error', (err) => handleErrors(err));
      socket.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socket.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // listening for joined events
      socket.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
        }
        setClients(clients);
        socket.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      // listening for leave events
      socket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
      });
    };

    init();

    return () => {
      isSubscribed = false;
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance.off(ACTIONS.DISCONNECTED);
        socketInstance.off(ACTIONS.JOINED);
      } else if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  // Deduplicate clients by socketId to ensure clean rendering
  const uniqueClients = clients.filter(
    (client, index, self) =>
      index === self.findIndex((c) => c.socketId === client.socketId)
  );

  return (
    <div className="mainWrap">
      <aside className="aside">
        <div className="asideInner">
          <div className="brandHeader">
            <img className="logoImage" src={logo} alt="CodeSync Logo" />
            <div className="liveIndicator">
              <span className="pulseDot"></span>
              <span className="liveText">Live Session</span>
            </div>
          </div>

          <div className="sectionHeader">
            <h3>Connected Peers</h3>
            <span className="peerBadge">{uniqueClients.length}</span>
          </div>

          <div className="clientsList">
            {uniqueClients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <div className="actionGroup">
          <button className="btn copyBtn" onClick={copyRoomId}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy Room ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Leave Room
          </button>
        </div>
      </aside>

      <main className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </main>
    </div>
  );
};

export default EditorPage;




