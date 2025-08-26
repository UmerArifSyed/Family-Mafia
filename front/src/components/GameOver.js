import React from 'react';

const GameOver = ({ socket, gameState }) => {
  const amIModerator = socket.id === gameState.moderator;

  const handleResetGame = () => {
    socket.emit('resetGame');
  };

  return (
    <div className="game-over-container">
      <h1>Game Over!</h1>
      <p className="game-over-message">{gameState.message}</p>
      
      <div className="final-roles">
        <h2>Final Roles:</h2>
        <ul>
          {Object.values(gameState.players).map(p => (
            <li key={p.name}>
              <strong>{p.name}</strong> was a {p.role} {p.isAlive ? '(Alive)' : '(Eliminated)'}
            </li>
          ))}
        </ul>
      </div>

      {amIModerator && (
        <div className="moderator-controls">
          <button className="reset-game-btn" onClick={handleResetGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameOver;