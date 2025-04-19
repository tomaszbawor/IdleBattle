// src/components/game/character/PlayerInfoCard.tsx
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Player from '@/engine/Player';

/**
 * StatBar component to display a stat with label and progress bar
 */
interface StatBarProps {
  /** Label text for the stat */
  label: string;
  /** Current stat value */
  current: number;
  /** Maximum stat value */
  max: number;
  /** Color for the progress bar in HEX or CSS format */
  color: string;
  /** Additional CSS class names */
  className?: string;
}

const StatBar: React.FC<StatBarProps> = ({
  label,
  current,
  max,
  color,
  className
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`mb-3 ${className}`}>
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{current}/{max}</span>
      </div>
      <Progress
        value={percentage}
        className="h-3"
        style={{ backgroundColor: 'rgb(221, 221, 221)' }}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{ backgroundColor: color }}
        />
      </Progress>
    </div>
  );
};

/**
 * PlayerInfoCard component props
 */
interface PlayerInfoCardProps {
  /** Player data to display */
  player: Player;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * PlayerInfoCard component
 * 
 * Displays player information in a card format with HP/MP bars and basic stats
 */
const PlayerInfoCard: React.FC<PlayerInfoCardProps> = ({
  player,
  isLoading = false,
  className
}) => {
  if (isLoading) {
    return (
      <Card className={`shadow-md ${className}`}>
        <CardHeader>
          <CardTitle className="text-center">Player</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 bg-gray-200 rounded mb-3"></div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-md ${className}`} data-testid="player-info-card">
      <CardHeader>
        <CardTitle className="text-center">
          {player.name || 'Player'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StatBar
          label="HP"
          current={player.hp}
          max={player.maxHp}
          color="#ff4040"
          data-testid="hp-bar"
        />
        <StatBar
          label="MP"
          current={player.mp}
          max={player.maxMp}
          color="#4a60d7"
          data-testid="mp-bar"
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div data-testid="player-level">Level: {player.level}</div>
            <div data-testid="player-race">Race: {player.race}</div>
          </div>
          <div>
            <div data-testid="player-str">Str: {player.stats.str}</div>
            <div data-testid="player-dex">Dex: {player.stats.dex}</div>
            <div data-testid="player-int">Int: {player.stats.int}</div>
          </div>
          <div>
            <div data-testid="player-will">Will: {player.stats.will}</div>
            <div data-testid="player-luck">Luck: {player.stats.luck}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerInfoCard;
export { StatBar };
