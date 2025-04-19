import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';

// Define types for stats and race data
interface Stats {
  str: number;
  dex: number;
  int: number;
  will: number;
  luck: number;
}

interface Race {
  name: string;
  baseStats: Stats;
  ageGrowth: Stats[];
}

interface Races {
  [key: string]: Race;
}

interface RaceButtonProps {
  race: string;
  isSelected: boolean;
  onClick: () => void;
}

interface AgeButtonProps {
  age: number;
  isSelected: boolean;
  onClick: () => void;
}

interface RaceSceneProps {
  onCharacterCreated: () => void;
}

interface CalculatedStats {
  initialStats: Stats;
  ageGrowth: Stats;
}

// Race data
const races: Races = {
  HUMAN: {
    name: 'Human',
    baseStats: { str: 10, dex: 10, int: 10, will: 10, luck: 10 },
    ageGrowth: [
      { str: 2, dex: 2, int: 2, will: 2, luck: 2 }, // Age 10
      { str: 2, dex: 2, int: 2, will: 2, luck: 2 }, // Age 11
      { str: 3, dex: 3, int: 3, will: 3, luck: 3 }, // Age 12
      { str: 3, dex: 3, int: 3, will: 3, luck: 3 }, // Age 13
      { str: 4, dex: 4, int: 4, will: 4, luck: 4 }, // Age 14
      { str: 4, dex: 4, int: 4, will: 4, luck: 4 }, // Age 15
      { str: 5, dex: 5, int: 5, will: 5, luck: 5 }, // Age 16
      { str: 5, dex: 5, int: 5, will: 5, luck: 5 }  // Age 17
    ]
  },
  ELF: {
    name: 'Elf',
    baseStats: { str: 8, dex: 12, int: 12, will: 8, luck: 10 },
    ageGrowth: [
      { str: 1, dex: 3, int: 3, will: 1, luck: 2 }, // Age 10
      { str: 1, dex: 3, int: 3, will: 1, luck: 2 }, // Age 11
      { str: 2, dex: 4, int: 4, will: 2, luck: 3 }, // Age 12
      { str: 2, dex: 4, int: 4, will: 2, luck: 3 }, // Age 13
      { str: 3, dex: 5, int: 5, will: 3, luck: 4 }, // Age 14
      { str: 3, dex: 5, int: 5, will: 3, luck: 4 }, // Age 15
      { str: 4, dex: 6, int: 6, will: 4, luck: 5 }, // Age 16
      { str: 4, dex: 6, int: 6, will: 4, luck: 5 }  // Age 17
    ]
  },
  DWARF: {
    name: 'Dwarf',
    baseStats: { str: 12, dex: 8, int: 8, will: 12, luck: 10 },
    ageGrowth: [
      { str: 3, dex: 1, int: 1, will: 3, luck: 2 }, // Age 10
      { str: 3, dex: 1, int: 1, will: 3, luck: 2 }, // Age 11
      { str: 4, dex: 2, int: 2, will: 4, luck: 3 }, // Age 12
      { str: 4, dex: 2, int: 2, will: 4, luck: 3 }, // Age 13
      { str: 5, dex: 3, int: 3, will: 5, luck: 4 }, // Age 14
      { str: 5, dex: 3, int: 3, will: 5, luck: 4 }, // Age 15
      { str: 6, dex: 4, int: 4, will: 6, luck: 5 }, // Age 16
      { str: 6, dex: 4, int: 4, will: 6, luck: 5 }  // Age 17
    ]
  },
  GIANT: {
    name: 'Giant',
    baseStats: { str: 14, dex: 6, int: 6, will: 14, luck: 10 },
    ageGrowth: [
      { str: 4, dex: 1, int: 1, will: 4, luck: 2 }, // Age 10
      { str: 4, dex: 1, int: 1, will: 4, luck: 2 }, // Age 11
      { str: 5, dex: 1, int: 1, will: 5, luck: 3 }, // Age 12
      { str: 5, dex: 1, int: 1, will: 5, luck: 3 }, // Age 13
      { str: 6, dex: 2, int: 2, will: 6, luck: 4 }, // Age 14
      { str: 6, dex: 2, int: 2, will: 6, luck: 4 }, // Age 15
      { str: 7, dex: 2, int: 2, will: 7, luck: 5 }, // Age 16
      { str: 7, dex: 2, int: 2, will: 7, luck: 5 }  // Age 17
    ]
  },
  UNDEAD: {
    name: 'Undead',
    baseStats: { str: 10, dex: 10, int: 14, will: 6, luck: 10 },
    ageGrowth: [
      { str: 2, dex: 2, int: 4, will: 1, luck: 2 }, // Age 10
      { str: 2, dex: 2, int: 4, will: 1, luck: 2 }, // Age 11
      { str: 3, dex: 3, int: 5, will: 1, luck: 3 }, // Age 12
      { str: 3, dex: 3, int: 5, will: 1, luck: 3 }, // Age 13
      { str: 4, dex: 4, int: 6, will: 2, luck: 4 }, // Age 14
      { str: 4, dex: 4, int: 6, will: 2, luck: 4 }, // Age 15
      { str: 5, dex: 5, int: 7, will: 2, luck: 5 }, // Age 16
      { str: 5, dex: 5, int: 7, will: 2, luck: 5 }  // Age 17
    ]
  }
};

const RaceButton: React.FC<RaceButtonProps> = ({ race, isSelected, onClick }) => {
  return (
    <button
      className={`button ${isSelected ? 'selected-button' : ''}`}
      onClick={onClick}
      style={{
        width: '200px',
        height: '50px',
        margin: '5px',
        backgroundColor: isSelected ? '#2a40b7' : '#4a60d7'
      }}
    >
      {races[race].name}
    </button>
  );
};

const AgeButton: React.FC<AgeButtonProps> = ({ age, isSelected, onClick }) => {
  return (
    <button
      className={`button ${isSelected ? 'selected-button' : ''}`}
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        margin: '5px',
        backgroundColor: isSelected ? '#2a40b7' : '#4a60d7'
      }}
    >
      {age}
    </button>
  );
};

const RaceScene: React.FC<RaceSceneProps> = ({ onCharacterCreated }) => {
  const { state, actions } = useGame();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [showAgePanel, setShowAgePanel] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);

  const handleRaceSelect = (race: string): void => {
    setSelectedRace(race);
    setShowAgePanel(true);
    if (!showAgePanel) {
      // Simulate fade-in effect
      setTimeout(() => setShowAgePanel(true), 10);
    }
  };

  const handleAgeSelect = (age: number): void => {
    setSelectedAge(age);
    setShowInfoPanel(true);
    if (!showInfoPanel) {
      // Simulate fade-in effect
      setTimeout(() => setShowInfoPanel(true), 10);
    }
  };

  const calculateStats = (): CalculatedStats | null => {
    if (!selectedRace || !selectedAge) return null;

    const race = races[selectedRace];
    const ageIndex = selectedAge - 10; // Convert age to array index (10 -> 0, 11 -> 1, etc.)
    const ageGrowth = race.ageGrowth[ageIndex];

    // Calculate initial stats
    const initialStats = { ...race.baseStats };

    return {
      initialStats,
      ageGrowth
    };
  };

  const handleCreateCharacter = (): void => {
    const stats = calculateStats();
    if (!stats) return;

    // Update player with race and age information
    actions.updatePlayer({
      race: selectedRace,
      age: selectedAge,
      stats: {
        str: stats.initialStats.str,
        dex: stats.initialStats.dex,
        int: stats.initialStats.int,
        will: stats.initialStats.will,
        luck: stats.initialStats.luck
      },
      ageGrowth: stats.ageGrowth
    });

    // Save the game
    actions.saveGame(state.currentSlot || 1);

    // Proceed to main game
    onCharacterCreated();
  };

  const stats = calculateStats();

  return (
    <div className="scene race-scene" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Choose Your Race and Age</h2>

      {/* Race Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        <RaceButton
          race="HUMAN"
          isSelected={selectedRace === "HUMAN"}
          onClick={() => handleRaceSelect("HUMAN")}
        />
        <RaceButton
          race="ELF"
          isSelected={selectedRace === "ELF"}
          onClick={() => handleRaceSelect("ELF")}
        />
        <RaceButton
          race="DWARF"
          isSelected={selectedRace === "DWARF"}
          onClick={() => handleRaceSelect("DWARF")}
        />
        <RaceButton
          race="GIANT"
          isSelected={selectedRace === "GIANT"}
          onClick={() => handleRaceSelect("GIANT")}
        />
        <RaceButton
          race="UNDEAD"
          isSelected={selectedRace === "UNDEAD"}
          onClick={() => handleRaceSelect("UNDEAD")}
        />
      </div>

      {/* Age Selection */}
      {showAgePanel && (
        <div
          style={{
            position: 'absolute',
            top: '200px',
            left: '380px',
            display: 'flex',
            flexWrap: 'wrap',
            width: '220px'
          }}
        >
          {[10, 11, 12, 13, 14, 15, 16, 17].map(age => (
            <AgeButton
              key={age}
              age={age}
              isSelected={selectedAge === age}
              onClick={() => handleAgeSelect(age)}
            />
          ))}
        </div>
      )}

      {/* Info Panel */}
      {showInfoPanel && stats && (
        <div
          style={{
            position: 'absolute',
            top: '150px',
            left: '380px',
            width: '400px',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            border: '1px solid #74748c'
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>AGE: {selectedAge}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Initial Stats: </span>
            <span>Str {stats.initialStats.str} Dex {stats.initialStats.dex} Int {stats.initialStats.int} Will {stats.initialStats.will} Luck {stats.initialStats.luck}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>Age Growth: </span>
            <span>Str+{stats.ageGrowth.str} Dex+{stats.ageGrowth.dex} Int+{stats.ageGrowth.int} Will+{stats.ageGrowth.will} Luck+{stats.ageGrowth.luck}</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '12px' }}>(Level-up Growth: 1/4 of Age Growth)</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button 
              variant="flicker" 
              onClick={handleCreateCharacter} 
              className="w-[250px] h-[50px]"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceScene;
