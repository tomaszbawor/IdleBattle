import React from 'react';
import { useGame } from '../../../context/GameContext';
import MapCell from './MapCell';
import { getAllMaps } from '@/engine/maps/MapData';

// Reuse the MapData interface from MapCell.tsx
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

interface MapPanelProps {
  onClose: () => void;
}

const MapPanel: React.FC<MapPanelProps> = ({ onClose }) => {
  const { state, actions } = useGame();
  const maps = getAllMaps();

  const handleSelectMap = (map: MapData): void => {
    // Update the current map in the game state
    actions.setMap(map);

    // Reset battle if there's an active one
    if (state.battle) {
      actions.startBattle(state.player?.level || 1, false);
    }

    // Close the map panel
    onClose();
  };

  return (
    <div
      className="map-panel"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '500px',
        backgroundColor: '#f0f0f0',
        border: '2px solid #74748c',
        borderRadius: '10px',
        padding: '20px',
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>World Map</h2>
        <button
          className="button"
          onClick={onClose}
          style={{ padding: '5px 10px' }}
        >
          Close
        </button>
      </div>

      <div
        className="map-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          backgroundColor: '#d0d0d0',
          borderRadius: '5px',
          overflow: 'hidden'
        }}
      >
        {/* Map background - could be an image in a real implementation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#d0d0d0'
          }}
        />

        {/* Map cells */}
        {maps.map((map: MapData) => (
          <MapCell
            key={map.id}
            map={map}
            onSelect={handleSelectMap}
          />
        ))}

        {/* Current location indicator */}
        {state.map && (
          <div
            style={{
              position: 'absolute',
              left: `${state.map.x + 20}px`,
              top: `${state.map.y + 20}px`,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#ff0000',
              boxShadow: '0 0 5px #ff0000'
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <p>Click on a location to travel there. Locked locations require higher player level.</p>
        <p>Current location: {state.map ? state.map.name : 'None'}</p>
      </div>
    </div>
  );
};

export default MapPanel;
