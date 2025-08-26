import React from 'react';

const RoleCard = ({ socket, gameState }) => {
  const myPlayer = gameState.players[socket.id];
  const amIModerator = socket.id === gameState.moderator;

  // Filter the players to ensure only those with a name are shown
  const namedPlayers = Object.values(gameState.players).filter(p => p.name);

  // Moderator view: show all roles
  if (amIModerator) {
    return (
      <div className="role-card-container">
        <h1>Roles have been assigned.</h1>
        <div className="moderator-role-list">
          <h2>Player Roles:</h2>
          <ul>
            {namedPlayers.map(p => (
              <li key={p.name}><strong>{p.name}</strong> is a {p.role}</li>
            ))}
          </ul>
        </div>
        <div className="moderator-controls">
          <button className="start-btn" onClick={() => socket.emit('startNight')}>Start Night</button>
          <button className="pause-btn" onClick={() => socket.emit('pauseGame')}>Pause Game</button>
          <button className="reset-btn" onClick={() => socket.emit('resetGame')}>Restart Game</button>
        </div>
      </div>
    );
  }

  // Player view: show only their own role
  return (
    <div className="role-card-container">
      <div className="role-card">
        <h2>Your Secret Role is...</h2>
        <div className={`role-reveal ${myPlayer?.role?.toLowerCase()}`}>
          <h1>{myPlayer?.role}</h1>
        </div>
        <p className="role-description">Wait for the moderator to begin the first phase.</p>
      </div>
    </div>
  );
};

export default RoleCard;