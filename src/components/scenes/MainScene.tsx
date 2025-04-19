import React, { useState, useEffect } from 'react';
import MapPanel from '../ui/map/MapPanel';
import { useGame } from '@/context/GameContext';
import { getSkillById } from '@/engine/skills/SkillData';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface Skill {
  id: string;
  name: string;
}

interface Item {
  name: string;
}

// Custom StatBar component using shadcn Progress
const StatBar: React.FC<{
  label: string;
  current: number;
  max: number;
  color: string;
}> = ({ label, current, max, color }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <Progress
        value={percentage}
        className="h-3"
        style={{
          backgroundColor: 'rgb(221, 221, 221)',
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{ backgroundColor: color }}
        />
      </Progress>
    </div>
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
    debugger;
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
    <div className="scene main-scene bg-slate-200 p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Player Info Panel */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Player</CardTitle>
            </CardHeader>
            <CardContent>
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
              <div className="grid grid-cols-3 gap-4 mt-4">
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
            </CardContent>
          </Card>

          {/* Battle Log Panel */}
          <Card className="shadow-md h-64 overflow-auto">
            <CardHeader>
              <CardTitle className="text-center">Battle Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {getBattleLog().map((log, index) => (
                  <div key={index} className="mb-2">{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Menu Buttons Panel */}
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => { }}>Shop</Button>
                <Button onClick={() => { }}>Inventory</Button>
                <Button onClick={() => setShowMapPanel(true)}>Map</Button>
                <Button onClick={() => { }}>Help</Button>
                <Button onClick={() => actions.saveGame(1)}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Monster Info Panel */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Monster</CardTitle>
            </CardHeader>
            <CardContent>
              {state.battle?.monster ? (
                <>
                  <StatBar
                    label="HP"
                    current={state.battle.monster.hp}
                    max={state.battle.monster.hp}
                    color="#ff4040"
                  />
                  <div className="text-center mt-4">
                    <div>{state.battle.monster.name}</div>
                    <div>Level {state.battle.monster.level}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">No monster</div>
              )}
            </CardContent>
          </Card>

          {/* Pet Info Panel */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Pet</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <div className="text-center mt-4">
                    <div>{state.pet.name}</div>
                    <div>Level {state.pet.level}</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">No pet</div>
              )}
            </CardContent>
          </Card>

          {/* Battle Skills Panel */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Battle Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Button
                  onClick={handleAttack}
                  disabled={!state.battle || !state.battle.isActive || state.battle.turn < 0}
                >
                  Attack
                </Button>
                {getPlayerSkills().map(skill => (
                  <Button
                    key={skill.id}
                    onClick={() => handleUseSkill(skill.id)}
                    disabled={!state.battle || !state.battle.isActive || state.battle.turn < 0}
                  >
                    {skill.name}
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <Button
                  onClick={toggleAutoMode}
                  variant={autoMode ? "destructive" : "default"}
                >
                  {autoMode ? "Manual Mode" : "Auto Mode"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loot Panel */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Loot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 justify-items-center">
                {state.inventory.slice(0, 4).map((item: Item, index: number) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-slate-200 border border-slate-400 rounded flex justify-center items-center text-xs cursor-pointer hover:bg-slate-300"
                    title={item.name}
                    onClick={() => actions.equipItem(item)}
                  >
                    {item.name.substring(0, 3)}
                  </div>
                ))}
                {Array(4 - Math.min(state.inventory.length, 4)).fill(0).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="w-12 h-12 bg-slate-200 border border-slate-400 rounded"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Panel */}
      {showMapPanel && (
        <MapPanel onClose={() => setShowMapPanel(false)} />
      )}
    </div>
  );
};

export default MainScene;
