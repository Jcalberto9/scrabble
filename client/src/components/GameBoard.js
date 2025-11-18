import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 40px);
  grid-template-rows: repeat(15, 40px);
  gap: 2px;
  background-color: #8B4513;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const Square = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${props => {
    if (props.hasLetter) return '#f5deb3';
    switch (props.premium) {
      case 'TW': return '#ff4444';
      case 'DW': return '#ffaaaa';
      case 'TL': return '#4444ff';
      case 'DL': return '#aaaaff';
      case 'star': return '#ffff44';
      default: return '#f5f5f5';
    }
  }};

  color: ${props => {
    if (props.hasLetter) return '#000';
    switch (props.premium) {
      case 'TW': case 'DW': return '#fff';
      case 'TL': case 'DL': return '#fff';
      case 'star': return '#000';
      default: return '#666';
    }
  }};

  border: ${props => props.isNew ? '3px solid #00ff00' : '1px solid #ccc'};

  &:hover {
    transform: ${props => !props.hasLetter ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => !props.hasLetter ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'};
  }
`;

const Letter = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #000;
`;

const Points = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 8px;
  font-weight: bold;
`;

const PremiumText = styled.div`
  font-size: 8px;
  text-align: center;
  line-height: 1;
  font-weight: bold;
`;

const getLetterPoints = (letter) => {
  const points = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
    'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
    'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10, '_': 0
  };
  return points[letter] || 0;
};

const getPremiumText = (premium) => {
  switch (premium) {
    case 'TW': return 'TRIPLE\nWORD\nSCORE';
    case 'DW': return 'DOUBLE\nWORD\nSCORE';
    case 'TL': return 'TRIPLE\nLETTER\nSCORE';
    case 'DL': return 'DOUBLE\nLETTER\nSCORE';
    case 'star': return '★';
    default: return '';
  }
};

const BoardSquare = ({ square, row, col, onTilePlaced, onTileRemoved }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'tile',
    drop: (item) => {
      if (!square.letter) {
        onTilePlaced(row, col, item);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleClick = () => {
    if (square.letter && square.isNew) {
      onTileRemoved(row, col);
    }
  };

  return (
    <Square
      ref={drop}
      hasLetter={!!square.letter}
      premium={square.premium}
      isNew={square.isNew}
      isOver={isOver}
      onClick={handleClick}
    >
      {square.letter ? (
        <>
          <Letter>{square.letter}</Letter>
          <Points>{getLetterPoints(square.letter)}</Points>
        </>
      ) : (
        <PremiumText>
          {getPremiumText(square.premium).split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </PremiumText>
      )}
    </Square>
  );
};

const GameBoard = ({ board, selectedTiles, onTilePlaced, onTileRemoved }) => {
  return (
    <BoardContainer>
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => (
          <BoardSquare
            key={`${rowIndex}-${colIndex}`}
            square={square}
            row={rowIndex}
            col={colIndex}
            onTilePlaced={onTilePlaced}
            onTileRemoved={onTileRemoved}
          />
        ))
      )}
    </BoardContainer>
  );
};

export default GameBoard;