import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import RoleCard from './components/RoleCard';
import Night from './components/Night';
import Day from './components/Day';
import GameOver from './components/GameOver';
import Pause from './components/Pause';
import './App.css';

const socket = io.connect('http://localhost:3001');

function App() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('gameStateUpdate', (newGameState) => {
      setGameState(newGameState);
    });
    return () => socket.off('gameStateUpdate');
  }, []);

  const renderPhase = () => {
    if (!gameState) {
      return <div className="loading">Connecting to server...</div>;
    }
    
    switch (gameState.phase) {
      case 'LOBBY':
        return <Lobby socket={socket} gameState={gameState} />;
      case 'ROLES':
        return <RoleCard socket={socket} gameState={gameState} />;
      case 'NIGHT':
        return <Night socket={socket} gameState={gameState} />;
      case 'DAY':
        return <Day socket={socket} gameState={gameState} />;
      case 'PAUSED':
        return <Pause socket={socket} gameState={gameState} />;
      case 'GAME_OVER':
        return <GameOver socket={socket} gameState={gameState} />;
      default:
        return <div className="loading">Loading game...</div>;
    }
  };

  return (
    <div className="app-container">
      {renderPhase()}
    </div>
  );
}

export default App;