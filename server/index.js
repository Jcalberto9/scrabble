const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const GameManager = require('./gameManager');
const WordValidator = require('./wordValidator');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

const gameManager = new GameManager();
const wordValidator = new WordValidator();

// Game rooms storage
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create a new game room
  socket.on('createRoom', (playerName) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const game = gameManager.createGame(roomCode);
    const playerId = gameManager.addPlayer(roomCode, playerName, socket.id);

    rooms.set(roomCode, {
      hostId: socket.id,
      players: new Set([socket.id])
    });

    socket.join(roomCode);
    socket.emit('roomCreated', {
      roomCode,
      playerId,
      game: gameManager.getGameState(roomCode)
    });

    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  // Join existing room
  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const game = gameManager.getGame(roomCode);

    if (!game) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (game.players.length >= 15) {
      socket.emit('error', { message: 'Room is full (max 15 players)' });
      return;
    }

    if (game.status !== 'waiting') {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    const playerId = gameManager.addPlayer(roomCode, playerName, socket.id);
    const room = rooms.get(roomCode);
    room.players.add(socket.id);

    socket.join(roomCode);
    socket.emit('joinedRoom', {
      roomCode,
      playerId,
      game: gameManager.getGameState(roomCode)
    });

    // Notify all players in the room
    io.to(roomCode).emit('playerJoined', {
      player: game.players.find(p => p.id === playerId),
      totalPlayers: game.players.length
    });

    console.log(`${playerName} joined room ${roomCode}`);
  });

  // Start game
  socket.on('startGame', (roomCode) => {
    const room = rooms.get(roomCode);
    if (!room || room.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game' });
      return;
    }

    const game = gameManager.getGame(roomCode);
    if (game.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players to start' });
      return;
    }

    gameManager.startGame(roomCode);
    io.to(roomCode).emit('gameStarted', gameManager.getGameState(roomCode));

    console.log(`Game started in room ${roomCode}`);
  });

  // Make a move
  socket.on('makeMove', ({ roomCode, move }) => {
    try {
      const game = gameManager.getGame(roomCode);
      const currentPlayer = game.players[game.currentPlayerIndex];

      if (currentPlayer.socketId !== socket.id) {
        socket.emit('error', { message: 'Not your turn' });
        return;
      }

      // Validate the move
      const isValidWord = wordValidator.validateWord(move.word);
      if (!isValidWord) {
        socket.emit('error', { message: 'Invalid word' });
        return;
      }

      // Process the move
      const result = gameManager.makeMove(roomCode, move);

      if (result.success) {
        io.to(roomCode).emit('moveAccepted', {
          move: result.move,
          game: gameManager.getGameState(roomCode)
        });
      } else {
        socket.emit('error', { message: result.error });
      }
    } catch (error) {
      console.error('Error making move:', error);
      socket.emit('error', { message: 'Failed to make move' });
    }
  });

  // Pass turn
  socket.on('passTurn', (roomCode) => {
    const game = gameManager.getGame(roomCode);
    const currentPlayer = game.players[game.currentPlayerIndex];

    if (currentPlayer.socketId !== socket.id) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    gameManager.passTurn(roomCode);
    io.to(roomCode).emit('turnPassed', gameManager.getGameState(roomCode));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Find and handle player leaving rooms
    for (const [roomCode, room] of rooms) {
      if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        gameManager.removePlayer(roomCode, socket.id);

        // Notify remaining players
        io.to(roomCode).emit('playerLeft', {
          game: gameManager.getGameState(roomCode)
        });

        // If room is empty, clean it up
        if (room.players.size === 0) {
          rooms.delete(roomCode);
          gameManager.deleteGame(roomCode);
        }

        break;
      }
    }
  });
});

// Catch all handler: send back React's index.html file in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});