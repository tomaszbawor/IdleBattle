import React, { useState } from 'react';
import { useGame } from '../../../context/GameContext';

// Define the Map interface
interface MapData {
  id: string;
  name: string;
  level: number;
  averageCp: number;
  description: string;
  x: number;
  y: number;
  isAccessible: (playerLevel: number) => boolean;
}

interface MapCellProps {
  map: MapData;
  onSelect: (map: MapData) => void;
}

const MapCell: React.FC<MapCellProps> = ({ map, onSelect }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { state } = useGame();
  
  const isAccessible = map.isAccessible(state.player?.level || 1);
  
  const handleMouseEnter = (): void => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };
  
  const handleClick = (): void => {
    if (isAccessible) {
      onSelect(map);
    }
  };
  
  return (
    <div 
      className={`map-cell ${isHovered && isAccessible ? 'map-cell-hovered' : ''} ${!isAccessible ? 'map-cell-locked' : ''}`}
      style={{
        position: 'absolute',
        left: `${map.x}px`,
        top: `${map.y}px`,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: isAccessible ? (isHovered ? '#e3b310' : '#4a60d7') : '#888888',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: isAccessible ? 'pointer' : 'not-allowed',
        transition: 'background-color 0.3s',
        boxShadow: isHovered && isAccessible ? '0 0 10px #e3b310' : 'none'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {map.id.charAt(0).toUpperCase()}
      
      {isHovered && (
        <div 
          className="map-tooltip"
          style={{
            position: 'absolute',
            top: '45px',
            left: '0',
            width: '200px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #74748c',
            borderRadius: '5px',
            padding: '10px',
            zIndex: 100,
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{map.name}</div>
          <div>Level: {map.level}</div>
          <div>Avg. CP: {map.averageCp}</div>
          <div style={{ fontSize: '12px' }}>{map.description}</div>
          {!isAccessible && (
            <div style={{ color: 'red' }}>
              Locked: Requires level {map.level}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapCell;