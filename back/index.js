const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { assignRoles } = require('./utils/gameLogic');
const { handleNightActions, handleDayVoting } = require('./utils/gamePhases');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let gameState = {
  phase: 'LOBBY',
  players: {},
  moderator: null,
  nightActions: [],
  dayVotes: [],
  message: '',
  previousPhase: null, // New state property
};

const checkWinConditions = () => {
    const mafiaCount = Object.values(gameState.players).filter(p => p.role === 'Mafia' && p.isAlive).length;
    const townsfolkCount = Object.values(gameState.players).filter(p => p.role !== 'Mafia' && p.isAlive).length;
    
    if (mafiaCount === 0) {
        gameState.message = 'The Townsfolk have won! All Mafia have been eliminated.';
        return 'TOWNSFOLK_WIN';
    } else if (mafiaCount >= townsfolkCount) {
        gameState.message = 'The Mafia have won! They outnumber the Townsfolk.';
        return 'MAFIA_WIN';
    }
    return null;
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  gameState.players[socket.id] = { name: null, role: null, isAlive: true };
  io.emit('gameStateUpdate', gameState);

  socket.on('playerJoin', (name) => {
    if (gameState.players[socket.id]) {
      gameState.players[socket.id].name = name;
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('claimModerator', () => {
    if (!gameState.moderator) {
      gameState.moderator = socket.id;
      delete gameState.players[socket.id]; 
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('startGame', () => {
    if (socket.id === gameState.moderator) {
      const playerIds = Object.keys(gameState.players);
      const assignedRoles = assignRoles(playerIds);
      
      for (const id in gameState.players) {
        gameState.players[id].role = assignedRoles[id];
      }
      
      gameState.phase = 'ROLES';
      gameState.message = 'Roles have been assigned. Game begins!';
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('startNight', () => {
    if (socket.id === gameState.moderator) {
      gameState.phase = 'NIGHT';
      gameState.nightActions = [];
      gameState.message = 'Night has fallen. All players, close your eyes...';
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('nightAction', (targetId) => {
    const player = gameState.players[socket.id];
    if (gameState.phase === 'NIGHT' && player) {
      const existingActionIndex = gameState.nightActions.findIndex(action => action.playerId === socket.id);
      if (existingActionIndex !== -1) {
        gameState.nightActions[existingActionIndex].targetId = targetId;
      } else {
        gameState.nightActions.push({ playerId: socket.id, targetId });
      }
    }
  });

  socket.on('startDay', () => {
    if (socket.id === gameState.moderator) {
      const { killedPlayerId, detectiveResult } = handleNightActions(gameState.players, gameState.nightActions);

      if (killedPlayerId) {
        gameState.players[killedPlayerId].isAlive = false;
        gameState.message = `Day has begun. Last night, ${gameState.players[killedPlayerId].name} was killed.`;
      } else {
        gameState.message = 'Day has begun. No one was killed last night.';
      }

      if (detectiveResult) {
        io.to(detectiveResult.playerId).emit('detectiveResult', detectiveResult);
      }
      
      gameState.phase = 'DAY';
      gameState.dayVotes = [];
      io.emit('gameStateUpdate', gameState);
    }
  });
  
  socket.on('vote', (targetId) => {
    if (gameState.phase === 'DAY') {
      const existingVoteIndex = gameState.dayVotes.findIndex(vote => vote.voterId === socket.id);
      if (existingVoteIndex !== -1) {
        gameState.dayVotes[existingVoteIndex].targetId = targetId;
      } else {
        gameState.dayVotes.push({ voterId: socket.id, targetId });
      }
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('endDay', () => {
    if (socket.id === gameState.moderator) {
      const eliminatedPlayerId = handleDayVoting(gameState.players, gameState.dayVotes);
      if (eliminatedPlayerId) {
        gameState.players[eliminatedPlayerId].isAlive = false;
        gameState.message = `${gameState.players[eliminatedPlayerId].name} was eliminated.`;
      } else {
        gameState.message = 'The town could not agree on a target. No one was eliminated.';
      }
      
      const winStatus = checkWinConditions();
      if (winStatus) {
        gameState.phase = 'GAME_OVER';
      } else {
        gameState.phase = 'NIGHT_OR_DAY'; 
      }
      io.emit('gameStateUpdate', gameState);
    }
  });

  // NEW: Moderator pauses the game
  socket.on('pauseGame', () => {
    if (socket.id === gameState.moderator) {
      gameState.previousPhase = gameState.phase;
      gameState.phase = 'PAUSED';
      gameState.message = 'The game has been paused by the moderator.';
      io.emit('gameStateUpdate', gameState);
    }
  });

  // NEW: Moderator resumes the game
  socket.on('resumeGame', () => {
    if (socket.id === gameState.moderator && gameState.phase === 'PAUSED') {
      gameState.phase = gameState.previousPhase;
      gameState.previousPhase = null;
      gameState.message = 'The game has resumed.';
      io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('resetGame', () => {
    if (socket.id === gameState.moderator) {
        gameState = {
            phase: 'LOBBY',
            players: {},
            moderator: null,
            nightActions: [],
            dayVotes: [],
            message: '',
            previousPhase: null,
        };
        io.emit('gameStateUpdate', gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (gameState.moderator === socket.id) {
      gameState.moderator = null;
    } else {
      delete gameState.players[socket.id];
    }
    io.emit('gameStateUpdate', gameState);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});