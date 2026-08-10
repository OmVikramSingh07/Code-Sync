import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Code-Sync.png';

const HomePage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Generated new unique Room ID');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Both Room ID and Username are required');
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="cardHeader">
          <img className="homePageLogo" src={logo} alt="Code-Sync Logo" />
        </div>

        <h2 className="titleHeading">Code-Sync</h2>
        <p className="mainLabel">Paste an invitation Room ID or create a new room to collaborate in real-time.</p>

        <div className="inputGroup">
          <div className="inputFieldWrap">
            <span className="inputIcon">#</span>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="inputBox"
              placeholder="ROOM ID"
              onKeyUp={handleInputEnter}
            />
          </div>

          <div className="inputFieldWrap">
            <span className="inputIcon">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="inputBox"
              placeholder="YOUR USERNAME"
              onKeyUp={handleInputEnter}
            />
          </div>

          <button onClick={joinRoom} className="btn joinBtn">
            <span>Join Room</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

          <div className="createInfo">
            If you do not have an invite then{' '}
            <button onClick={createNewRoom} type="button" className="createNewBtn">
              create new room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
