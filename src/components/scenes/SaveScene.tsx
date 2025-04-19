import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardFooter } from '../ui/card';

interface SaveSlotProps {
  slotNumber: number;
  onNewGame: () => void;
  onLoadGame: () => void;
}

interface SlotData {
  player: {
    name: string;
  };
  time: string;
}

interface SaveSceneProps {
  onNewGame: () => void;
  onLoadGame: () => void;
}

const SaveSlot: React.FC<SaveSlotProps> = ({ slotNumber, onNewGame, onLoadGame }) => {
  const { actions } = useGame();
  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [showNewButton, setShowNewButton] = useState<boolean>(false);

  useEffect(() => {
    // Check if slot has saved data
    const savedData = localStorage.getItem(`slot${slotNumber}`);
    if (savedData) {
      setSlotData(JSON.parse(savedData));
    }
  }, [slotNumber]);

  const handleInputChange = (newName: string, newPassword: string, newConfirmPassword: string): void => {
    if (newPassword === '' || newConfirmPassword === '' || newName === '') {
      setShowNewButton(false);
      setWarning('Please fill the blank');
      return;
    }

    if (newName.trim().length < 3) {
      setShowNewButton(false);
      setWarning('Name must be at least 3 characters');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setShowNewButton(false);
      setWarning('Password is not same');
      return;
    }

    if (newPassword.length < 4) {
      setShowNewButton(false);
      setWarning('Password must be at least 4 characters');
      return;
    }

    setWarning('OK');
    setShowNewButton(true);
  };

  const handleNewGame = (): void => {
    // In a real implementation, we would check if the name is already taken
    // For now, we'll just simulate a successful creation
    actions.setPlayer({
      name,
      password,
      level: 1,
      exp: 0,
      hp: 100,
      mp: 50,
      // Other player properties would be set in the RaceScene
    });
    onNewGame();
  };

  const handleLoadGame = (): void => {
    actions.loadGame(slotNumber);
    onLoadGame();
  };

  if (slotData) {
    // Render existing save slot
    return (
      <Card className="my-4 hover:border-blue-500 transition-colors duration-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div>
                <span className="font-bold text-slate-700 uppercase text-sm">Name: </span>
                <span className="text-slate-900 font-medium">{slotData.player.name}</span>
              </div>
              <div className="text-slate-600 text-sm">
                <span>Saved: {slotData.time}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="flicker" 
                onClick={handleLoadGame} 
                className="font-bold shadow-sm"
              >
                LOAD
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this save?')) {
                    localStorage.removeItem(`slot${slotNumber}`);
                    setSlotData(null);
                  }
                }}
                className="text-xs font-medium"
              >
                DELETE
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render new save slot
  return (
    <Card className="my-4 hover:border-blue-500 transition-colors duration-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="font-bold text-slate-700 uppercase text-sm w-24">Name: </span>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => {
                const newName = e.target.value;
                setName(newName);
                handleInputChange(newName, password, confirmPassword);
              }}
              className="border border-slate-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none flex-1"
              placeholder="Enter character name"
            />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-slate-700 uppercase text-sm w-24">Password: </span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => {
                const newPassword = e.target.value;
                setPassword(newPassword);
                handleInputChange(name, newPassword, confirmPassword);
              }}
              className="border border-slate-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none flex-1"
              placeholder="Enter password"
            />
          </div>
          <div className="flex items-center">
            <span className="font-bold text-slate-700 uppercase text-sm w-24">Confirm: </span>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => {
                const newConfirmPassword = e.target.value;
                setConfirmPassword(newConfirmPassword);
                handleInputChange(name, password, newConfirmPassword);
              }}
              className="border border-slate-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none flex-1"
              placeholder="Confirm password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {showNewButton && (
          <Button 
            variant="flicker" 
            onClick={handleNewGame} 
            className="font-bold shadow-sm"
          >
            NEW
          </Button>
        )}
        <span className={`text-sm ${warning === 'OK' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}`}>
          {warning}
        </span>
      </CardFooter>
    </Card>
  );
};

const SaveScene: React.FC<SaveSceneProps> = ({ onNewGame, onLoadGame }) => {
  return (
    <div className="scene save-scene bg-gradient-to-b from-white to-slate-100 p-4 md:p-8 min-h-screen">
      <h2 className="text-center mb-8 text-2xl md:text-3xl font-bold text-slate-800 drop-shadow-sm">
        Select or Create a Character
      </h2>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-4">
          <SaveSlot slotNumber={1} onNewGame={onNewGame} onLoadGame={onLoadGame} />
          <SaveSlot slotNumber={2} onNewGame={onNewGame} onLoadGame={onLoadGame} />
          <SaveSlot slotNumber={3} onNewGame={onNewGame} onLoadGame={onLoadGame} />
          <SaveSlot slotNumber={4} onNewGame={onNewGame} onLoadGame={onLoadGame} />
        </div>
      </div>
    </div>
  );
};

export default SaveScene;
