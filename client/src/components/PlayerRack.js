import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

const RackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: #8B4513;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  min-height: 70px;
`;

const TileContainer = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f5deb3;
  border: 2px solid #daa520;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.draggable ? 'grab' : 'default'};
  position: relative;
  font-weight: bold;
  transition: all 0.2s ease;
  opacity: ${props => props.isDragging ? 0.5 : 1};

  &:hover {
    transform: ${props => props.draggable ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.draggable ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'};
  }

  &:active {
    cursor: ${props => props.draggable ? 'grabbing' : 'default'};
  }
`;

const Letter = styled.div`
  font-size: 20px;
  color: #000;
  margin-bottom: -2px;
`;

const Points = styled.div`
  font-size: 10px;
  color: #000;
  position: absolute;
  bottom: 4px;
  right: 4px;
`;

const EmptySlot = styled.div`
  width: 50px;
  height: 50px;
  border: 2px dashed #666;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
`;

const RackLabel = styled.div`
  color: white;
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
`;

const DraggableTile = ({ tile, index, isDraggable }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'tile',
    item: tile,
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <TileContainer
      ref={isDraggable ? drag : null}
      draggable={isDraggable}
      isDragging={isDragging}
    >
      <Letter>{tile.letter === '_' ? '?' : tile.letter}</Letter>
      <Points>{tile.points}</Points>
    </TileContainer>
  );
};

const PlayerRack = ({ tiles = [], isMyTurn, onTileSelect }) => {
  // Ensure we always show 7 slots
  const displayTiles = [...tiles];
  while (displayTiles.length < 7) {
    displayTiles.push(null);
  }

  return (
    <RackContainer>
      <RackLabel>Your Tiles:</RackLabel>
      {displayTiles.map((tile, index) => (
        <div key={index}>
          {tile ? (
            <DraggableTile
              tile={tile}
              index={index}
              isDraggable={isMyTurn}
            />
          ) : (
            <EmptySlot>empty</EmptySlot>
          )}
        </div>
      ))}
    </RackContainer>
  );
};

export default PlayerRack;