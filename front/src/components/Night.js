import React, { useState } from 'react';

const Night = ({ socket, gameState }) => {
  const [target, setTarget] = useState(null);
  const myPlayer = gameState.players[socket.id];
  const amIModerator = socket.id === gameState.moderator;

  const alivePlayers = Object.keys(gameState.players)
    .filter(id => gameState.players[id].isAlive)
    .filter(id => id !== socket.id);

  const handleTargetSelect = (playerId) => {
    setTarget(playerId);
    socket.emit('nightAction', playerId);
  };

  if (amIModerator) {
    return (
      <div className="night-container moderator-view">
        <h2>Night has fallen.</h2>
        <p>Players are performing their actions in secret.</p>
        <div className="moderator-controls">
          <button className="next-phase-btn" onClick={() => socket.emit('startDay')}>Start Day</button>
          <button className="pause-btn" onClick={() => socket.emit('pauseGame')}>Pause Game</button>
          <button className="reset-btn" onClick={() => socket.emit('resetGame')}>Restart Game</button>
        </div>
      </div>
    );
  }

  // View for the Mafia
  if (myPlayer.role === 'Mafia') {
    return (
      <div className="night-container mafia-view">
        <h2>Night has fallen.</h2>
        <p className="night-instruction">You are the Mafia. Choose a player to eliminate.</p>
        <ul className="player-list">
          {alivePlayers.map(playerId => (
            <li
              key={playerId}
              className={`player-item ${target === playerId ? 'selected' : ''}`}
              onClick={() => handleTargetSelect(playerId)}
            >
              {gameState.players[playerId].name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // View for the Doctor
  if (myPlayer.role === 'Doctor') {
    return (
      <div className="night-container doctor-view">
        <h2>Night has fallen.</h2>
        <p className="night-instruction">You are the Doctor. Choose a player to save from elimination.</p>
        <ul className="player-list">
          {alivePlayers.map(playerId => (
            <li
              key={playerId}
              className={`player-item ${target === playerId ? 'selected' : ''}`}
              onClick={() => handleTargetSelect(playerId)}
            >
              {gameState.players[playerId].name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // View for the Detective
  if (myPlayer.role === 'Detective') {
    return (
      <div className="night-container detective-view">
        <h2>Night has fallen.</h2>
        <p className="night-instruction">You are the Detective. Choose a player to investigate.</p>
        <ul className="player-list">
          {alivePlayers.map(playerId => (
            <li
              key={playerId}
              className={`player-item ${target === playerId ? 'selected' : ''}`}
              onClick={() => handleTargetSelect(playerId)}
            >
              {gameState.players[playerId].name}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Generic view for other players (Townsfolk)
  return (
    <div className="night-container generic-view">
      <h2>Night has fallen.</h2>
      <p className="night-instruction">You are sleeping. Wait for day to arrive.</p>
    </div>
  );
};

export default Night;