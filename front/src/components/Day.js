import React, { useState, useEffect } from 'react';

const Day = ({ socket, gameState }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const amIModerator = socket.id === gameState.moderator;
  const alivePlayers = Object.keys(gameState.players).filter(id => gameState.players[id].isAlive);

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleConfirmVote = () => {
    if (selectedPlayer) {
      socket.emit('vote', selectedPlayer);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Hide notification after 3 seconds
    }
  };

  const handleAbstain = () => {
    setSelectedPlayer('ABSTAIN');
    socket.emit('vote', 'ABSTAIN');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide notification after 3 seconds
  };

  if (amIModerator) {
    return (
      <div className="day-container moderator-view">
        <h2>Day is here.</h2>
        <p>Guide the discussion and voting.</p>
        <div className="vote-summary">
          <h3>Current Votes:</h3>
          <ul>
            {gameState.dayVotes.map((vote, index) => (
              <li key={index}>
                {gameState.players[vote.voterId].name} voted for {gameState.players[vote.targetId].name}
              </li>
            ))}
          </ul>
        </div>
        <div className="moderator-controls">
          <button className="next-phase-btn" onClick={() => socket.emit('endDay')}>End Day</button>
          <button className="pause-btn" onClick={() => socket.emit('pauseGame')}>Pause Game</button>
          <button className="reset-btn" onClick={() => socket.emit('resetGame')}>Restart Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className="day-container player-view">
      {showNotification && (
        <div className="notification">
          Vote casted!
        </div>
      )}
      <h2>{gameState.message}</h2>
      <h3>Who do you suspect?</h3>
      <ul className="player-list">
        {alivePlayers.map(playerId => (
          <li
            key={playerId}
            className={`player-item ${selectedPlayer === playerId ? 'selected' : ''}`}
            onClick={() => handleSelectPlayer(playerId)}
          >
            {gameState.players[playerId].name}
          </li>
        ))}
      </ul>
      <button 
        className="confirm-vote-btn" 
        onClick={handleConfirmVote} 
        disabled={!selectedPlayer || selectedPlayer === 'ABSTAIN'}
      >
        Confirm Vote
      </button>
      <button 
        className="abstain-btn" 
        onClick={handleAbstain}
      >
        Abstain
      </button>
    </div>
  );
};

export default Day;