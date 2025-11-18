import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import io from 'socket.io-client';
import styled from 'styled-components';
import GameBoard from './components/GameBoard';
import PlayerRack from './components/PlayerRack';
import PlayerList from './components/PlayerList';
import GameControls from './components/GameControls';
import JoinRoom from './components/JoinRoom';
import GameOver from './components/GameOver';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f0f0;
`;

const GameContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 20px;
`;

const CenterPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Header = styled.div`
  background-color: #8B4513;
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 1.1em;
  opacity: 0.9;
`;

const ErrorMessage = styled.div`
  background-color: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
`;

const InfoMessage = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [selectedTiles, setSelectedTiles] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('roomCreated', ({ roomCode, playerId, game }) => {
      setPlayerData({ roomCode, playerId });
      setGameState(game);
      setInfo(`Room created! Code: ${roomCode}`);
      setError('');
    });

    newSocket.on('joinedRoom', ({ roomCode, playerId, game }) => {
      setPlayerData({ roomCode, playerId });
      setGameState(game);
      setInfo(`Joined room: ${roomCode}`);
      setError('');
    });

    newSocket.on('playerJoined', ({ player, totalPlayers }) => {
      setInfo(`${player.name} joined the game (${totalPlayers} players)`);
      // Update game state will come from server
    });

    newSocket.on('playerLeft', ({ game }) => {
      setGameState(game);
      setInfo('A player left the game');
    });

    newSocket.on('gameStarted', (game) => {
      setGameState(game);
      setInfo('Game started!');
    });

    newSocket.on('moveAccepted', ({ move, game }) => {
      setGameState(game);
      setSelectedTiles([]);
      setInfo(`${move.player} played "${move.word}" for ${move.score} points!`);
    });

    newSocket.on('turnPassed', (game) => {
      setGameState(game);
      setInfo('Turn passed');
    });

    newSocket.on('error', ({ message }) => {
      setError(message);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setError('Disconnected from server');
    });

    return () => newSocket.close();
  }, []);

  const createRoom = (playerName) => {
    if (socket) {
      socket.emit('createRoom', playerName);
    }
  };

  const joinRoom = (roomCode, playerName) => {
    if (socket) {
      socket.emit('joinRoom', { roomCode, playerName });
    }
  };

  const startGame = () => {
    if (socket && playerData) {
      socket.emit('startGame', playerData.roomCode);
    }
  };

  const makeMove = (move) => {
    if (socket && playerData) {
      socket.emit('makeMove', {
        roomCode: playerData.roomCode,
        move
      });
    }
  };

  const passTurn = () => {
    if (socket && playerData) {
      socket.emit('passTurn', playerData.roomCode);
    }
  };

  const getCurrentPlayer = () => {
    if (!gameState || !playerData) return null;
    return gameState.players.find(p => p.id === playerData.playerId);
  };

  const isMyTurn = () => {
    if (!gameState || !playerData) return false;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    return currentPlayer && currentPlayer.id === playerData.playerId;
  };

  const clearMessages = () => {
    setError('');
    setInfo('');
  };

  // Show join room screen if not connected to a game
  if (!gameState || !playerData) {
    return (
      <AppContainer>
        <Header>
          <Title>Scrabble Online</Title>
          <Subtitle>Multiplayer Word Game</Subtitle>
        </Header>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {info && <InfoMessage>{info}</InfoMessage>}
        <JoinRoom onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      </AppContainer>
    );
  }

  // Show game over screen if game is finished
  if (gameState.status === 'finished') {
    return (
      <AppContainer>
        <Header>
          <Title>Scrabble Online</Title>
          <Subtitle>Game Finished!</Subtitle>
        </Header>
        <GameOver
          gameState={gameState}
          onNewGame={() => {
            setGameState(null);
            setPlayerData(null);
            clearMessages();
          }}
        />
      </AppContainer>
    );
  }

  const currentPlayer = getCurrentPlayer();

  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Header>
          <Title>Scrabble Online</Title>
          <Subtitle>
            Room: {playerData.roomCode} |
            {gameState.status === 'waiting' ? ' Waiting for players' : ' Game in progress'}
          </Subtitle>
        </Header>

        {error && <ErrorMessage onClick={clearMessages}>{error}</ErrorMessage>}
        {info && <InfoMessage onClick={clearMessages}>{info}</InfoMessage>}

        <GameContainer>
          <LeftPanel>
            <PlayerList
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
              currentPlayerId={playerData.playerId}
            />

            <GameControls
              gameState={gameState}
              playerData={playerData}
              currentPlayer={currentPlayer}
              isMyTurn={isMyTurn()}
              selectedTiles={selectedTiles}
              onStartGame={startGame}
              onMakeMove={makeMove}
              onPassTurn={passTurn}
            />
          </LeftPanel>

          <CenterPanel>
            <GameBoard
              board={gameState.board}
              selectedTiles={selectedTiles}
              onTilePlaced={(row, col, tile) => {
                setSelectedTiles(prev => [...prev, { row, col, ...tile }]);
              }}
              onTileRemoved={(row, col) => {
                setSelectedTiles(prev => prev.filter(t => !(t.row === row && t.col === col)));
              }}
            />

            {currentPlayer && (
              <PlayerRack
                tiles={currentPlayer.tiles}
                isMyTurn={isMyTurn()}
                onTileSelect={(tile) => {
                  // Handle tile selection for placement
                }}
              />
            )}
          </CenterPanel>
        </GameContainer>
      </AppContainer>
    </DndProvider>
  );
}

export default App;