import React, { useState, useEffect } from 'react';
import MapPanel from '../ui/map/MapPanel';
import { useGame } from '@/context/GameContext';
import { getSkillById } from '@/engine/skills/SkillData';

// Define types for props and state
interface PanelProps {
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
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
  className?: string;
}

interface Skill {
  id: string;
  name: string;
}

interface Item {
  name: string;
}

// UI Components
const Panel: React.FC<PanelProps> = ({ title, children, style, className }) => {
  return (
    <div
      className={`border-2 border-[#74748c] rounded-md p-2.5 bg-[#f0f0f0] ${className || ''}`}
      style={style}
    >
      {title && <h3 className="m-0 mb-2.5 text-center">{title}</h3>}
      {children}
    </div>
  );
};

const StatBar: React.FC<StatBarProps> = ({ label, current, max, color }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="mb-1.5">
      <div className="flex justify-between mb-0.5">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <div className="w-full h-[15px] bg-[#ddd] rounded overflow-hidden">
        <div
          className="h-full transition-width duration-300 ease-in-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

const Button: React.FC<ButtonProps> = ({ text, onClick, style, disabled, className }) => {
  return (
    <button
      className={`px-2.5 py-1.5 m-1.5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
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
    <div className="scene main-scene bg-[#c0c0c0] p-2.5 relative">
      {/* Player Info Panel */}
      <Panel
        title="Player"
        className="absolute top-2.5 left-2.5 w-[380px]"
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
        <div className="flex justify-between mt-2.5">
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
        className="absolute top-2.5 left-[400px] w-[180px]"
      >
        {state.battle?.monster ? (
          <>
            <StatBar
              label="HP"
              current={state.battle.monster.hp}
              max={state.battle.monster.hp}
              color="#ff4040"
            />
            <div className="text-center mt-2.5">
              <div>{state.battle.monster.name}</div>
              <div>Level {state.battle.monster.level}</div>
            </div>
          </>
        ) : (
          <div className="text-center">No monster</div>
        )}
      </Panel>

      {/* Pet Info Panel */}
      <Panel
        title="Pet"
        className="absolute top-[150px] left-[400px] w-[180px]"
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
            <div className="text-center mt-2.5">
              <div>{state.pet.name}</div>
              <div>Level {state.pet.level}</div>
            </div>
          </>
        ) : (
          <div className="text-center">No pet</div>
        )}
      </Panel>

      {/* Battle Skills Panel */}
      <Panel
        title="Battle Skills"
        className="absolute top-[235px] left-[415px] w-[165px]"
      >
        <div className="flex flex-wrap justify-center">
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
        <div className="text-center mt-2.5">
          <Button
            text={autoMode ? "Manual Mode" : "Auto Mode"}
            onClick={toggleAutoMode}
            className={autoMode ? "bg-[#ff4040]" : "bg-[#4a60d7]"}
          />
        </div>
      </Panel>

      {/* Info Panel */}
      <Panel
        title="Battle Log"
        className="absolute top-[235px] left-2.5 w-[380px] h-[150px] overflow-auto"
      >
        <div>
          {getBattleLog().map((log, index) => (
            <div key={index} className="mb-1.5">{log}</div>
          ))}
        </div>
      </Panel>

      {/* Loot Panel */}
      <Panel
        title="Loot"
        className="absolute top-[405px] left-[415px] w-[165px] h-[150px]"
      >
        <div className="flex flex-wrap justify-center">
          {state.inventory.slice(0, 4).map((item: Item, index: number) => (
            <div
              key={index}
              className="w-[40px] h-[40px] m-1.5 bg-[#ddd] border border-[#999] flex justify-center items-center text-[10px] cursor-pointer"
              title={item.name}
              onClick={() => actions.equipItem(item)}
            >
              {item.name.substring(0, 3)}
            </div>
          ))}
          {Array(4 - Math.min(state.inventory.length, 4)).fill(0).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-[40px] h-[40px] m-1.5 bg-[#ddd] border border-[#999]"
            />
          ))}
        </div>
      </Panel>

      {/* Other Panel */}
      <Panel className="absolute top-[405px] left-2.5 w-[165px]">
        <div className="flex flex-col items-center">
          <Button text="Shop" onClick={() => { }} className="w-[100px]" />
          <Button text="Inventory" onClick={() => { }} className="w-[100px]" />
          <Button
            text="Map"
            className="w-[100px]"
            onClick={() => setShowMapPanel(true)}
          />
          <Button text="Help" onClick={() => { }} className="w-[100px]" />
          <Button
            text="Save"
            className="w-[100px]"
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
