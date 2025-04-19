import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { getSkillById } from '../../data/skills/SkillData';
import { getItemById } from '../../data/items/ItemData';
import MapPanel from '../ui/map/MapPanel';

// Define types for props and state
interface PanelProps {
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  color: string;
}

interface ButtonProps {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

interface Skill {
  id: string;
  name: string;
}

interface Item {
  name: string;
}

// UI Components
const Panel: React.FC<PanelProps> = ({ title, children, style }) => {
  return (
    <div 
      style={{ 
        border: '2px solid #74748c',
        borderRadius: '5px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        ...style
      }}
    >
      {title && <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>{title}</h3>}
      {children}
    </div>
  );
};

const StatBar: React.FC<StatBarProps> = ({ label, current, max, color }) => {
  const percentage = (current / max) * 100;

  return (
    <div style={{ marginBottom: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <div style={{ width: '100%', height: '15px', backgroundColor: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            backgroundColor: color,
            transition: 'width 0.3s ease-in-out'
          }} 
        />
      </div>
    </div>
  );
};

const Button: React.FC<ButtonProps> = ({ text, onClick, style, disabled }) => {
  return (
    <button 
      className="button"
      onClick={onClick}
      disabled={disabled}
      style={{ 
        padding: '5px 10px',
        margin: '5px',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {text}
    </button>
  );
};

const MainScene: React.FC = () => {
  const { state, actions } = useGame();
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const [battleInterval, setBattleInterval] = useState<NodeJS.Timeout | null>(null);
  const [showMapPanel, setShowMapPanel] = useState<boolean>(false);

  // Initialize battle if not already active
  useEffect(() => {
    if (!state.battle && state.player) {
      actions.startBattle(state.player.level);
    }
  }, [state.battle, state.player, actions]);

  // Auto battle mode
  useEffect(() => {
    if (autoMode && state.battle && state.battle.isActive) {
      const interval = setInterval(() => {
        actions.processBattleTurn();
      }, 2000);

      setBattleInterval(interval);

      return () => clearInterval(interval);
    } else if (battleInterval) {
      clearInterval(battleInterval);
      setBattleInterval(null);
    }
  }, [autoMode, state.battle, actions, battleInterval]);

  // Handle manual attack
  const handleAttack = (): void => {
    if (state.battle && state.battle.isActive && state.battle.turn > 0) {
      actions.processBattleTurn();
    }
  };

  // Handle skill use
  const handleUseSkill = (skillId: string): void => {
    if (state.battle && state.battle.isActive && state.battle.turn > 0) {
      actions.useSkill(skillId);
    }
  };

  // Toggle auto battle mode
  const toggleAutoMode = (): void => {
    setAutoMode(!autoMode);
  };

  // Get player skills
  const getPlayerSkills = (): Skill[] => {
    if (!state.player || !state.player.skills) return [];

    return state.player.skills.map((skillId: string) => {
      return getSkillById(skillId);
    }).filter((skill: Skill | null): skill is Skill => skill !== null);
  };

  // Get battle log
  const getBattleLog = (): string[] => {
    if (!state.battle) return [];
    return state.battle.battleLog || [];
  };

  return (
    <div className="scene main-scene" style={{ backgroundColor: '#c0c0c0', padding: '10px' }}>
      {/* Player Info Panel */}
      <Panel 
        title="Player" 
        style={{ position: 'absolute', top: '10px', left: '10px', width: '380px' }}
      >
        <StatBar 
          label="HP" 
          current={state.player?.hp || 0} 
          max={state.player?.maxHp || 100} 
          color="#ff4040" 
        />
        <StatBar 
          label="MP" 
          current={state.player?.mp || 0} 
          max={state.player?.maxMp || 50} 
          color="#4a60d7" 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <div>
            <div>Level: {state.player?.level || 1}</div>
            <div>Race: {state.player?.race || 'Human'}</div>
          </div>
          <div>
            <div>Str: {state.player?.stats?.str || 10}</div>
            <div>Dex: {state.player?.stats?.dex || 10}</div>
            <div>Int: {state.player?.stats?.int || 10}</div>
          </div>
          <div>
            <div>Will: {state.player?.stats?.will || 10}</div>
            <div>Luck: {state.player?.stats?.luck || 10}</div>
          </div>
        </div>
      </Panel>

      {/* Monster Info Panel */}
      <Panel 
        title="Monster" 
        style={{ position: 'absolute', top: '10px', left: '400px', width: '180px' }}
      >
        {state.battle?.monster ? (
          <>
            <StatBar 
              label="HP" 
              current={state.battle.monster.hp} 
              max={state.battle.monster.hp} 
              color="#ff4040" 
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <div>{state.battle.monster.name}</div>
              <div>Level {state.battle.monster.level}</div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>No monster</div>
        )}
      </Panel>

      {/* Pet Info Panel */}
      <Panel 
        title="Pet" 
        style={{ position: 'absolute', top: '150px', left: '400px', width: '180px' }}
      >
        {state.pet ? (
          <>
            <StatBar 
              label="HP" 
              current={state.pet.hp} 
              max={state.pet.maxHp} 
              color="#ff4040" 
            />
            <StatBar 
              label="MP" 
              current={state.pet.mp} 
              max={state.pet.maxMp} 
              color="#4a60d7" 
            />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <div>{state.pet.name}</div>
              <div>Level {state.pet.level}</div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>No pet</div>
        )}
      </Panel>

      {/* Battle Skills Panel */}
      <Panel 
        title="Battle Skills" 
        style={{ position: 'absolute', top: '235px', left: '415px', width: '165px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            text="Attack" 
            onClick={handleAttack} 
            disabled={!state.battle || !state.battle.isActive || state.battle.turn < 0}
          />
          {getPlayerSkills().map(skill => (
            <Button 
              key={skill.id}
              text={skill.name}
              onClick={() => handleUseSkill(skill.id)}
              disabled={!state.battle || !state.battle.isActive || state.battle.turn < 0}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Button 
            text={autoMode ? "Manual Mode" : "Auto Mode"} 
            onClick={toggleAutoMode} 
            style={{ backgroundColor: autoMode ? '#ff4040' : '#4a60d7' }}
          />
        </div>
      </Panel>

      {/* Info Panel */}
      <Panel 
        title="Battle Log" 
        style={{ position: 'absolute', top: '235px', left: '10px', width: '380px', height: '150px', overflow: 'auto' }}
      >
        <div>
          {getBattleLog().map((log, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>{log}</div>
          ))}
        </div>
      </Panel>

      {/* Loot Panel */}
      <Panel 
        title="Loot" 
        style={{ position: 'absolute', top: '405px', left: '415px', width: '165px', height: '150px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {state.inventory.slice(0, 4).map((item: Item, index: number) => (
            <div 
              key={index}
              style={{ 
                width: '40px', 
                height: '40px', 
                margin: '5px', 
                backgroundColor: '#ddd', 
                border: '1px solid #999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '10px',
                cursor: 'pointer'
              }}
              title={item.name}
              onClick={() => actions.equipItem(item)}
            >
              {item.name.substring(0, 3)}
            </div>
          ))}
          {Array(4 - Math.min(state.inventory.length, 4)).fill(0).map((_, index) => (
            <div 
              key={`empty-${index}`}
              style={{ 
                width: '40px', 
                height: '40px', 
                margin: '5px', 
                backgroundColor: '#ddd', 
                border: '1px solid #999' 
              }}
            />
          ))}
        </div>
      </Panel>

      {/* Other Panel */}
      <Panel 
        style={{ position: 'absolute', top: '10px', left: '590px', width: '180px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button text="Shop" onClick={() => {}} style={{ width: '100px' }} />
          <Button text="Inventory" onClick={() => {}} style={{ width: '100px' }} />
          <Button 
            text="Map" 
            style={{ width: '100px' }} 
            onClick={() => setShowMapPanel(true)}
          />
          <Button text="Help" onClick={() => {}} style={{ width: '100px' }} />
          <Button 
            text="Save" 
            style={{ width: '100px' }} 
            onClick={() => actions.saveGame(1)}
          />
        </div>
      </Panel>

      {/* Map Panel */}
      {showMapPanel && (
        <MapPanel onClose={() => setShowMapPanel(false)} />
      )}
    </div>
  );
};

export default MainScene;