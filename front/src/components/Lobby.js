import React, { useState } from 'react';

const Lobby = ({ socket, gameState }) => {
  const [name, setName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);

  // Filter players to only include those with a name
  const players = Object.values(gameState.players).filter(p => p.name);
  const moderator = gameState.moderator;
  const numPlayers = players.length;

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      socket.emit('playerJoin', name.trim());
      setIsNameSubmitted(true);
    }
  };
  
  const handleClaimModerator = () => {
    socket.emit('claimModerator');
    setIsNameSubmitted(true);
  };
  
  const handleStartGame = () => {
    socket.emit('startGame');
  };

  const amIModerator = socket.id === moderator;
  const amIPlayer = gameState.players[socket.id] && gameState.players[socket.id].name;

  return (
    <div className="lobby-container">
      <h1>Mafia Game Lobby</h1>
      
      {!isNameSubmitted && !amIPlayer && (
        <div className="join-section">
          <form onSubmit={handleNameSubmit} className="join-form">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength="15"
              required
            />
            <button type="submit">Join as Player</button>
          </form>
          {!moderator && <button onClick={handleClaimModerator}>Become Moderator</button>}
        </div>
      )}

      <div className="game-info-container">
        <div className="players-list">
          <h2>Players ({numPlayers})</h2>
          <ul>
            {players.map((player, index) => (
              player.name && <li key={index}>{player.name}</li>
            ))}
          </ul>
        </div>
        <div className="moderator-info">
          <h2>Moderator</h2>
          {moderator ? (
             <p className="moderator-name">{amIModerator ? 'You are the Moderator' : 'Moderator has been chosen'}</p>
           ) : (
            <p>Waiting for a moderator...</p>
          )}
        </div>
      </div>

       {amIModerator && (
         <div className="moderator-controls">
           <button className="start-game-btn" onClick={handleStartGame} disabled={numPlayers < 5}>
             Start Game ({numPlayers} Players)
           </button>
           {numPlayers < 5 && <p className="waiting-message">Need at least 5 players to start.</p>}
         </div>
       )}

       {amIPlayer && <p className="waiting-message">Welcome, {gameState.players[socket.id].name}! Waiting for the moderator to start the game.</p>}
    </div>
  );
};

export default Lobby;