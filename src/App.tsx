import { useState } from 'react'
import './App.css'
import { GameProvider } from './context/GameContext'
import BeginScene from './components/scenes/BeginScene';
import SaveScene from './components/scenes/SaveScene';
import RaceScene from './components/scenes/RaceScene';
import MainScene from './components/scenes/MainScene';

function App() {

  const [currentScene, setCurrentScene] = useState("start");

  const renderScene = () => {
    switch (currentScene) {
      case 'begin':
        return <BeginScene onPlay={() => setCurrentScene('save')} />;
      case 'save':
        return <SaveScene onNewGame={() => setCurrentScene('race')} onLoadGame={() => setCurrentScene('main')} />;
      case 'race':
        return <RaceScene onCharacterCreated={() => setCurrentScene('main')} />;
      case 'main':
        return <MainScene />;
      default:
        return <BeginScene onPlay={() => setCurrentScene('save')} />;
    }
  };

  return (
    <>
      <GameProvider>
        {renderScene()}
      </GameProvider>
    </>
  )
}

export default App
