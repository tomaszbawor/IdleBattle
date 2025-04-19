import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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

const RaceScene: React.FC<RaceSceneProps> = ({ onCharacterCreated }) => {
  const { state, actions } = useGame();
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [showAgePanel, setShowAgePanel] = useState<boolean>(false);
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);

  const handleRaceSelect = (race: string): void => {
    setSelectedRace(race);
    setShowAgePanel(true);
  };

  const handleAgeSelect = (age: number): void => {
    setSelectedAge(age);
    setShowInfoPanel(true);
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
    <div className="scene race-scene bg-white p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Race and Age</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Race Selection */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold mb-4">Select Race</h3>
          <div className="flex flex-col space-y-2">
            {Object.keys(races).map((race) => (
              <Button
                key={race}
                variant={selectedRace === race ? "default" : "outline"}
                className={`py-3 justify-start text-left ${selectedRace === race ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => handleRaceSelect(race)}
              >
                {races[race].name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          {/* Age Selection */}
          {showAgePanel && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Select Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 11, 12, 13, 14, 15, 16, 17].map(age => (
                    <Button
                      key={age}
                      variant={selectedAge === age ? "default" : "outline"}
                      className={`h-12 w-12 ${selectedAge === age ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => handleAgeSelect(age)}
                    >
                      {age}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Panel */}
          {showInfoPanel && stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Character Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="font-semibold">
                  AGE: {selectedAge}
                </div>
                <div>
                  <span className="font-semibold">Initial Stats: </span>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="text-center">
                      <div className="font-medium">Str</div>
                      <div>{stats.initialStats.str}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Dex</div>
                      <div>{stats.initialStats.dex}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Int</div>
                      <div>{stats.initialStats.int}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Will</div>
                      <div>{stats.initialStats.will}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Luck</div>
                      <div>{stats.initialStats.luck}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Age Growth: </span>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    <div className="text-center">
                      <div className="font-medium">Str+</div>
                      <div>{stats.ageGrowth.str}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Dex+</div>
                      <div>{stats.ageGrowth.dex}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Int+</div>
                      <div>{stats.ageGrowth.int}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Will+</div>
                      <div>{stats.ageGrowth.will}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Luck+</div>
                      <div>{stats.ageGrowth.luck}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  (Level-up Growth: 1/4 of Age Growth)
                </div>
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="flicker" 
                    onClick={handleCreateCharacter} 
                    className="px-8 py-2"
                  >
                    Create Character
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceScene;
