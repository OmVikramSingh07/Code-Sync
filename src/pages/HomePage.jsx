import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Code-Sync.png';

const HomePage = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'bright');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'bright' : 'dark'));
  };

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
      <div className="themeToggleWrap">
        <button
          type="button"
          className="themeToggleBtn"
          onClick={toggleTheme}
          aria-label="Toggle Bright/Dark Theme"
        >
          {theme === 'dark' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <span>Bright Mode</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      <div className="container">
        <div className="form_area formWrapper">
          <div className="cardHeader">
            <img className="homePageLogo" src={logo} alt="Code-Sync Logo" />
          </div>

          <p className="title titleHeading">CODE-SYNC</p>
          <p className="mainLabel">Paste an invitation Room ID or create a new room to collaborate in real-time.</p>

          <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }}>
            <div className="form_group inputFieldWrap">
              <label className="sub_title" htmlFor="roomId">Room ID</label>
              <div className="inputBoxContainer">
                <span className="inputIcon">#</span>
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="form_style inputBox"
                  placeholder="ROOM ID"
                  onKeyUp={handleInputEnter}
                />
              </div>
            </div>

            <div className="form_group inputFieldWrap">
              <label className="sub_title" htmlFor="username">Username</label>
              <div className="inputBoxContainer">
                <span className="inputIcon">@</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form_style inputBox"
                  placeholder="YOUR USERNAME"
                  onKeyUp={handleInputEnter}
                />
              </div>
            </div>

            <div>
              <button type="button" onClick={joinRoom} className="btn joinBtn">
                SIGN UP / JOIN ROOM
              </button>
              <p className="createInfo">
                If you do not have an invite then{' '}
                <button onClick={createNewRoom} type="button" className="createNewBtn link">
                  Create New Room
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
