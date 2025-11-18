import React from 'react';
import styled from 'styled-components';

const GameOverContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const WinnerSection = styled.div`
  margin-bottom: 40px;
`;

const WinnerTitle = styled.h1`
  color: #4CAF50;
  margin-bottom: 10px;
  font-size: 2.5em;
`;

const WinnerSubtitle = styled.p`
  color: #666;
  font-size: 1.2em;
  margin: 0;
`;

const ScoreboardContainer = styled.div`
  margin: 30px 0;
`;

const ScoreboardTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #8B4513;
  padding-bottom: 10px;
`;

const PlayerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 10px;
  background-color: ${props => {
    if (props.isWinner) return '#e8f5e8';
    if (props.position <= 3) return '#f0f8ff';
    return '#f9f9f9';
  }};
  border-left: 4px solid ${props => {
    if (props.isWinner) return '#4CAF50';
    if (props.position === 2) return '#ff9800';
    if (props.position === 3) return '#ff5722';
    return '#ddd';
  }};
  border-radius: 6px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Position = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.position) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#666';
    }
  }};
  color: ${props => props.position <= 3 ? '#333' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`;

const PlayerName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

const PlayerScore = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #8B4513;
`;

const GameStatsContainer = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
`;

const GameStatsTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StatLabel = styled.span`
  color: #666;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 15px 30px;
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
          &:hover { background-color: #45a049; }
        `;
      case 'secondary':
        return `
          background-color: #2196F3;
          color: white;
          &:hover { background-color: #1976D2; }
        `;
      default:
        return `
          background-color: #666;
          color: white;
          &:hover { background-color: #555; }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
  }
`;

const Trophy = styled.div`
  font-size: 4em;
  margin-bottom: 20px;
`;

const GameOver = ({ gameState, onNewGame }) => {
  // Sort players by score (descending)
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const totalScore = sortedPlayers.reduce((sum, player) => sum + player.score, 0);
  const averageScore = totalScore / sortedPlayers.length;

  return (
    <GameOverContainer>
      <Card>
        <WinnerSection>
          <Trophy>🏆</Trophy>
          <WinnerTitle>Game Over!</WinnerTitle>
          <WinnerSubtitle>
            {winner ? `${winner.name} wins with ${winner.score} points!` : 'Game completed!'}
          </WinnerSubtitle>
        </WinnerSection>

        <ScoreboardContainer>
          <ScoreboardTitle>Final Scores</ScoreboardTitle>
          {sortedPlayers.map((player, index) => (
            <PlayerRow
              key={player.id}
              position={index + 1}
              isWinner={index === 0}
            >
              <PlayerInfo>
                <Position position={index + 1}>
                  {index + 1}
                </Position>
                <PlayerName>{player.name}</PlayerName>
              </PlayerInfo>
              <PlayerScore>{player.score}</PlayerScore>
            </PlayerRow>
          ))}
        </ScoreboardContainer>

        <GameStatsContainer>
          <GameStatsTitle>Game Statistics</GameStatsTitle>
          <StatRow>
            <StatLabel>Total Players:</StatLabel>
            <StatValue>{gameState.players.length}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Total Turns:</StatLabel>
            <StatValue>{gameState.turnCount}</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Highest Score:</StatLabel>
            <StatValue>{winner ? winner.score : 0} points</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Average Score:</StatLabel>
            <StatValue>{averageScore.toFixed(1)} points</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Total Points:</StatLabel>
            <StatValue>{totalScore} points</StatValue>
          </StatRow>
          <StatRow>
            <StatLabel>Room Code:</StatLabel>
            <StatValue>{gameState.roomCode}</StatValue>
          </StatRow>
        </GameStatsContainer>

        <ButtonContainer>
          <Button variant="primary" onClick={onNewGame}>
            New Game
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </ButtonContainer>
      </Card>
    </GameOverContainer>
  );
};

export default GameOver;