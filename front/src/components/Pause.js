import React from 'react';

const Pause = ({ socket, gameState }) => {
  const amIModerator = socket.id === gameState.moderator;

  const handleResumeGame = () => {
    socket.emit('resumeGame');
  };

  return (
    <div className="pause-container">
      <h2>Game Paused</h2>
      <p>{gameState.message}</p>
      {amIModerator && (
        <button className="resume-game-btn" onClick={handleResumeGame}>
          Resume Game
        </button>
      )}
    </div>
  );
};

export default Pause;