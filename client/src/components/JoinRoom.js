import React, { useState } from 'react';
import styled from 'styled-components';

const JoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const CardTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8em;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 15px;

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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #ddd;
  }

  &::before {
    margin-right: 15px;
  }

  &::after {
    margin-left: 15px;
  }
`;

const DividerText = styled.span`
  color: #666;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
`;

const Instructions = styled.div`
  background-color: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  padding: 20px;
  margin-top: 30px;
`;

const InstructionsTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2em;
`;

const InstructionsList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #555;
  line-height: 1.6;
`;

const InstructionsItem = styled.li`
  margin-bottom: 8px;
`;

const JoinRoom = ({ onCreateRoom, onJoinRoom }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsCreating(true);
    try {
      await onCreateRoom(playerName.trim());
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim()) return;

    setIsJoining(true);
    try {
      await onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <JoinContainer>
      <Card>
        <CardTitle>Join Scrabble Game</CardTitle>

        <form onSubmit={handleCreateRoom}>
          <FormGroup>
            <Label htmlFor="playerName">Your Name</Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              required
            />
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            disabled={!playerName.trim() || isCreating}
          >
            {isCreating ? 'Creating Room...' : 'Create New Game'}
          </Button>
        </form>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

        <form onSubmit={handleJoinRoom}>
          <FormGroup>
            <Label htmlFor="roomCode">Room Code</Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              required
            />
          </FormGroup>

          <Button
            type="submit"
            variant="secondary"
            disabled={!playerName.trim() || !roomCode.trim() || isJoining}
          >
            {isJoining ? 'Joining Room...' : 'Join Existing Game'}
          </Button>
        </form>
      </Card>

      <Instructions>
        <InstructionsTitle>How to Play</InstructionsTitle>
        <InstructionsList>
          <InstructionsItem>
            <strong>Create a room</strong> to start a new game, or <strong>join</strong> an existing room with a code
          </InstructionsItem>
          <InstructionsItem>
            Games support <strong>2-15 players</strong> and start when the host clicks "Start Game"
          </InstructionsItem>
          <InstructionsItem>
            <strong>Drag tiles</strong> from your rack to the board to spell words
          </InstructionsItem>
          <InstructionsItem>
            Words must connect to existing tiles and be found in the dictionary
          </InstructionsItem>
          <InstructionsItem>
            Score points based on letter values and premium squares (double/triple letter/word)
          </InstructionsItem>
          <InstructionsItem>
            The game ends when a player uses all their tiles or all players pass consecutively
          </InstructionsItem>
        </InstructionsList>
      </Instructions>
    </JoinContainer>
  );
};

export default JoinRoom;