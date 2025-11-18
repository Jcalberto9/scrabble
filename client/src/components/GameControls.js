import React, { useState } from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ControlsTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 2px solid #8B4513;
  padding-bottom: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #4CAF50;
          color: white;
          &:hover:not(:disabled) { background-color: #45a049; }
        `;
      case 'secondary':
        return `
          background-color: #2196F3;
          color: white;
          &:hover:not(:disabled) { background-color: #1976D2; }
        `;
      case 'warning':
        return `
          background-color: #ff9800;
          color: white;
          &:hover:not(:disabled) { background-color: #e68900; }
        `;
      case 'danger':
        return `
          background-color: #f44336;
          color: white;
          &:hover:not(:disabled) { background-color: #da190b; }
        `;
      default:
        return `
          background-color: #666;
          color: white;
          &:hover:not(:disabled) { background-color: #555; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const WordInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const InfoSection = styled.div`
  background-color: #f5f5f5;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
`;

const InfoTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  color: #666;
`;

const InfoValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const TurnStatus = styled.div`
  background-color: ${props => props.isMyTurn ? '#e8f5e8' : '#fafafa'};
  border: 2px solid ${props => props.isMyTurn ? '#4CAF50' : '#ddd'};
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  color: ${props => props.isMyTurn ? '#2e7d32' : '#666'};
`;

const SelectedTilesDisplay = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 6px;
  border: 1px solid #b3d9ff;
`;

const SelectedTilesList = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const SelectedTile = styled.div`
  background-color: #e3f2fd;
  border: 1px solid #2196F3;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
`;

const GameControls = ({
  gameState,
  playerData,
  currentPlayer,
  isMyTurn,
  selectedTiles,
  onStartGame,
  onMakeMove,
  onPassTurn
}) => {
  const [wordInput, setWordInput] = useState('');

  const canStartGame = () => {
    return gameState.status === 'waiting' &&
           gameState.players.length >= 2 &&
           currentPlayer?.isHost;
  };

  const canMakeMove = () => {
    return gameState.status === 'playing' &&
           isMyTurn &&
           selectedTiles.length > 0 &&
           wordInput.trim().length > 0;
  };

  const handleMakeMove = () => {
    if (!canMakeMove()) return;

    const move = {
      word: wordInput.trim().toUpperCase(),
      tiles: selectedTiles.map(tile => ({
        row: tile.row,
        col: tile.col,
        letter: tile.letter
      }))
    };

    onMakeMove(move);
    setWordInput('');
  };

  const clearSelectedTiles = () => {
    // This would need to be implemented in the parent component
    // For now, we'll just clear the word input
    setWordInput('');
  };

  return (
    <ControlsContainer>
      <ControlsTitle>Game Controls</ControlsTitle>

      <TurnStatus isMyTurn={isMyTurn}>
        {gameState.status === 'waiting'
          ? 'Waiting for players...'
          : isMyTurn
          ? 'Your Turn!'
          : `${gameState.players[gameState.currentPlayerIndex]?.name}'s Turn`
        }
      </TurnStatus>

      <ButtonGroup>
        {gameState.status === 'waiting' && (
          <Button
            variant="primary"
            onClick={onStartGame}
            disabled={!canStartGame()}
          >
            {canStartGame() ? 'Start Game' : 'Need 2+ Players to Start'}
          </Button>
        )}

        {gameState.status === 'playing' && (
          <>
            {isMyTurn && (
              <>
                <WordInput
                  type="text"
                  placeholder="Enter the word you're spelling..."
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  disabled={selectedTiles.length === 0}
                />

                <Button
                  variant="primary"
                  onClick={handleMakeMove}
                  disabled={!canMakeMove()}
                >
                  Play Word ({selectedTiles.length} tiles)
                </Button>

                <Button
                  variant="warning"
                  onClick={onPassTurn}
                >
                  Pass Turn
                </Button>

                {selectedTiles.length > 0 && (
                  <Button
                    variant="secondary"
                    onClick={clearSelectedTiles}
                  >
                    Clear Selection
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </ButtonGroup>

      {selectedTiles.length > 0 && (
        <SelectedTilesDisplay>
          <InfoLabel>Selected Tiles:</InfoLabel>
          <SelectedTilesList>
            {selectedTiles.map((tile, index) => (
              <SelectedTile key={index}>
                {tile.letter} ({tile.row},{tile.col})
              </SelectedTile>
            ))}
          </SelectedTilesList>
        </SelectedTilesDisplay>
      )}

      <InfoSection>
        <InfoTitle>Game Info</InfoTitle>
        <InfoRow>
          <InfoLabel>Room Code:</InfoLabel>
          <InfoValue>{gameState.roomCode}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Players:</InfoLabel>
          <InfoValue>{gameState.players.length}/15</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>Tiles Remaining:</InfoLabel>
          <InfoValue>{gameState.tilesRemaining}</InfoValue>
        </InfoRow>
        {gameState.status === 'playing' && (
          <InfoRow>
            <InfoLabel>Turn Count:</InfoLabel>
            <InfoValue>{gameState.turnCount}</InfoValue>
          </InfoRow>
        )}
        {currentPlayer && (
          <>
            <InfoRow>
              <InfoLabel>Your Score:</InfoLabel>
              <InfoValue>{currentPlayer.score}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Your Tiles:</InfoLabel>
              <InfoValue>{currentPlayer.tileCount}</InfoValue>
            </InfoRow>
          </>
        )}
      </InfoSection>
    </ControlsContainer>
  );
};

export default GameControls;