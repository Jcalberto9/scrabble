import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-height: 400px;
  overflow-y: auto;
`;

const ListTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 2px solid #8B4513;
  padding-bottom: 8px;
`;

const PlayerCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  border: 2px solid ${props => props.isCurrentPlayer ? '#4CAF50' : '#ddd'};
  background-color: ${props => {
    if (props.isCurrentPlayer) return '#e8f5e8';
    if (props.isMe) return '#e3f2fd';
    return '#f9f9f9';
  }};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PlayerDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const PlayerScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Score = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #8B4513;
`;

const ScoreLabel = styled.div`
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
`;

const Badge = styled.span`
  background-color: ${props => {
    switch (props.type) {
      case 'host': return '#ff9800';
      case 'current': return '#4CAF50';
      case 'me': return '#2196F3';
      default: return '#666';
    }
  }};
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
`;

const TurnIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4CAF50;
  animation: pulse 1.5s infinite;
  margin-left: 8px;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const GameStats = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
`;

const StatLabel = styled.span`
  color: #666;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const PlayerList = ({ players, currentPlayerIndex, currentPlayerId }) => {
  const currentPlayer = players[currentPlayerIndex];

  return (
    <ListContainer>
      <ListTitle>Players ({players.length}/15)</ListTitle>

      {players.map((player, index) => {
        const isCurrentPlayer = index === currentPlayerIndex;
        const isMe = player.id === currentPlayerId;

        return (
          <PlayerCard
            key={player.id}
            isCurrentPlayer={isCurrentPlayer}
            isMe={isMe}
          >
            <PlayerInfo>
              <PlayerName>
                {player.name}
                {player.isHost && <Badge type="host">Host</Badge>}
                {isMe && <Badge type="me">You</Badge>}
                {isCurrentPlayer && <TurnIndicator />}
              </PlayerName>
              <PlayerDetails>
                {player.tileCount} tiles remaining
              </PlayerDetails>
            </PlayerInfo>

            <PlayerScore>
              <Score>{player.score}</Score>
              <ScoreLabel>Points</ScoreLabel>
            </PlayerScore>
          </PlayerCard>
        );
      })}

      <GameStats>
        <StatRow>
          <StatLabel>Current Turn:</StatLabel>
          <StatValue>{currentPlayer ? currentPlayer.name : 'N/A'}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Players:</StatLabel>
          <StatValue>{players.length}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Highest Score:</StatLabel>
          <StatValue>
            {players.length > 0 ? Math.max(...players.map(p => p.score)) : 0}
          </StatValue>
        </StatRow>
      </GameStats>
    </ListContainer>
  );
};

export default PlayerList;