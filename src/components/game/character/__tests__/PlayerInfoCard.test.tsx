// src/components/game/character/__tests__/PlayerInfoCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerInfoCard, { StatBar } from '../PlayerInfoCard';
import Player from '@/engine/Player';

// Create a mock player for testing
const createMockPlayer = () => {
  return new Player({
    name: 'Test Player',
    race: 'ELF',
    level: 5,
    hp: 80,
    maxHp: 100,
    mp: 30,
    maxMp: 50,
    stats: {
      str: 15,
      dex: 20,
      int: 25,
      will: 10,
      luck: 12
    }
  });
};

describe('StatBar Component', () => {
  it('renders with correct label and values', () => {
    render(
      <StatBar
        label="Test Stat"
        current={75}
        max={100}
        color="#ff0000"
      />
    );

    expect(screen.getByText('Test Stat')).toBeInTheDocument();
    expect(screen.getByText('75/100')).toBeInTheDocument();
  });

  it('renders progress bar with correct percentage', () => {
    render(
      <StatBar
        label="Test Stat"
        current={30}
        max={150}
        color="#ff0000"
      />
    );

    // Check that Progress component got the correct percentage value (30/150 = 20%)
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '20');
  });

  it('caps progress bar percentage at 100%', () => {
    render(
      <StatBar
        label="Test Stat"
        current={200}
        max={100}
        color="#ff0000"
      />
    );

    // Check that Progress component caps at 100%
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('applies custom color to progress bar', () => {
    render(
      <StatBar
        label="Test Stat"
        current={50}
        max={100}
        color="#0000ff"
      />
    );

    // Check that the progress bar inner div has the correct color
    const progressBarInner = screen.getByRole('progressbar').querySelector('div');
    expect(progressBarInner).toHaveStyle({ backgroundColor: '#0000ff' });
  });
});

describe
