import React, { useState, useEffect } from 'react';
import FlickerButton from '../ui/FlickerButton';
import { Button } from '../ui/button';
import { useGame } from '../../context/GameContext';

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

  const handleInputChange = (): void => {
    if (password === '' || confirmPassword === '' || name === '') {
      setShowNewButton(false);
      setWarning('Please fill the blank');
      return;
    }

    if (password !== confirmPassword) {
      setShowNewButton(false);
      setWarning('Password is not same');
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
      <div className="border-2 border-slate-500 w-[600px] h-[100px] relative my-2.5 p-2.5">
        <div className="mb-2.5">
          <span className="font-bold">NAME: </span>
          <span>{slotData.player.name}</span>
        </div>
        <div>
          <span>Saved: {slotData.time}</span>
        </div>
        <div className="absolute right-2.5 top-2.5">
          <FlickerButton text="LOAD" onClick={handleLoadGame} width={100} height={40} />
        </div>
        <div className="absolute right-2.5 bottom-2.5">
          <Button 
            variant="destructive"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this save?')) {
                localStorage.removeItem(`slot${slotNumber}`);
                setSlotData(null);
              }
            }}
            className="w-[50px] h-[20px] text-xs"
          >
            DELETE
          </Button>
        </div>
      </div>
    );
  }

  // Render new save slot
  return (
    <div className="border-2 border-slate-500 w-[600px] h-[100px] relative my-2.5 p-2.5">
      <div className="mb-2.5">
        <span className="font-bold">NAME: </span>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => {
            setName(e.target.value);
            handleInputChange();
          }} 
          className="border border-slate-500"
        />
      </div>
      <div className="mb-2.5">
        <span className="font-bold">Password: </span>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            handleInputChange();
          }} 
          className="border border-slate-500"
        />
      </div>
      <div className="mb-2.5">
        <span className="font-bold">Confirm: </span>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            handleInputChange();
          }} 
          className="border border-slate-500"
        />
      </div>
      <div className="absolute right-2.5 top-2.5">
        {showNewButton && (
          <FlickerButton text="NEW" onClick={handleNewGame} width={100} height={50} />
        )}
      </div>
      <div className="absolute right-2.5 bottom-2.5">
        <span>{warning}</span>
      </div>
    </div>
  );
};

const SaveScene: React.FC<SaveSceneProps> = ({ onNewGame, onLoadGame }) => {
  return (
    <div className="scene save-scene bg-white p-5">
      <h2 className="text-center mb-5 text-2xl font-bold">Select or Create a Character</h2>

      <div className="flex flex-col items-center">
        <SaveSlot slotNumber={1} onNewGame={onNewGame} onLoadGame={onLoadGame} />
        <SaveSlot slotNumber={2} onNewGame={onNewGame} onLoadGame={onLoadGame} />
        <SaveSlot slotNumber={3} onNewGame={onNewGame} onLoadGame={onLoadGame} />
        <SaveSlot slotNumber={4} onNewGame={onNewGame} onLoadGame={onLoadGame} />
      </div>
    </div>
  );
};

export default SaveScene;
