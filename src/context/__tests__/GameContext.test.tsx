// src/context/__tests__/GameContext.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import { GameProvider, useGame } from '../GameContext';

// Mock the required modules
vi.mock('@/engine/battle/Battle', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      player: null,
      pet: null,
      monster: null,
      turn: 1,
      battleLog: [],
      isActive: false,
      isBossBattle: false,
      startBattle: vi.fn().mockReturnValue({
        id: 'goblin',
        name: 'Goblin',
        hp: 50
      }),
      processTurn: vi.fn(),
      useSkill: vi.fn(),
      addToBattleLog: vi.fn()
    }))
  };
});

vi.mock('@/engine/monsters/MonsterData', () => ({
  getRandomMonster: vi.fn().mockReturnValue({
    id: 'goblin',
    name: 'Goblin',
    hp: 50
  }),
  getBoss: vi.fn().mockReturnValue({
    id: 'boss_goblin',
    name: 'Goblin King',
    hp: 200
  })
}));

vi.mock('@/engine/pets/PetData', () => ({
  getRandomPet: vi.fn().mockReturnValue({
    id: 'wolf',
    name: 'Wolf',
    type: 'wolf'
  })
}));

vi.mock('@/engine/items/ItemData', () => ({
  getRandomItem: vi.fn().mockReturnValue({
    id: 'sword_1',
    name: 'Iron Sword',
    type: 'weapon',
    slot: 'weapon',
    isEquipped: false,
    getValue: () => 100,
    getColor: () => '#FFFFFF',
    getDisplayName: () => '<span>Iron Sword</span>',
    getTooltip: () => '<div>Iron Sword</div>',
    use: vi.fn(),
    clone: vi.fn().mockReturnThis()
  })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Test component that uses the game context
const TestComponent = () => {
  const { state, actions } = useGame();

  return (
    <div>
      <div data-testid="player-name">
        {state.player ? state.player.name : 'No player'}
      </div>
      <button
        data-testid="create-player-btn"
        onClick={() => actions.setPlayer({ name: 'Test Player' })}
      >
        Create Player
      </button>
      <button
        data-testid="start-battle-btn"
        onClick={() => actions.startBattle(1)}
      >
        Start Battle
      </button>
      <button
        data-testid="process-turn-btn"
        onClick={() => actions.processBattleTurn()}
      >
        Process Turn
      </button>
      <button
        data-testid="toggle-sound-btn"
        onClick={() => actions.toggleSound()}
      >
        Toggle Sound
      </button>
      <button
        data-testid="save-game-btn"
        onClick={() => actions.saveGame(1)}
      >
        Save Game
      </button>
      <button
        data-testid="load-game-btn"
        onClick={() => actions.loadGame(1)}
      >
        Load Game
      </button>
      <div data-testid="sound-enabled">
        {state.sound.enabled ? 'Sound On' : 'Sound Off'}
      </div>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('provides the initial state', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Initial player should be null
    expect(screen.getByTestId('player-name')).toHaveTextContent('No player');

    // Sound should be enabled by default
    expect(screen.getByTestId('sound-enabled')).toHaveTextContent('Sound On');
  });

  it('creates a player when setPlayer is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Click the create player button
    fireEvent.click(screen.getByTestId('create-player-btn'));

    // Player should now exist with the given name
    expect(screen.getByTestId('player-name')).toHaveTextContent('Test Player');
  });

  it('starts a battle when startBattle is called', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Create a player first
    fireEvent.click(screen.getByTestId('create-player-btn'));

    // Start a battle
    await act(async () => {
      fireEvent.click(screen.getByTestId('start-battle-btn'));
    });

    // The mock Battle class's startBattle method should have been called
    const Battle = require('@/engine/battle/Battle').default;
    expect(Battle).toHaveBeenCalled();

    const battleInstance = Battle.mock.results[0].value;
    expect(battleInstance.startBattle).toHaveBeenCalledWith(1, false);
  });

  it('processes a battle turn when processBattleTurn is called', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Create a player
    fireEvent.click(screen.getByTestId('create-player-btn'));

    // Start a battle
    await act(async () => {
      fireEvent.click(screen.getByTestId('start-battle-btn'));
    });

    // Process a turn
    await act(async () => {
      fireEvent.click(screen.getByTestId('process-turn-btn'));
    });

    const Battle = require('@/engine/battle/Battle').default;
    const battleInstance = Battle.mock.results[0].value;
    expect(battleInstance.processTurn).toHaveBeenCalled();
  });

  it('toggles sound when toggleSound is called', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Sound should be enabled by default
    expect(screen.getByTestId('sound-enabled')).toHaveTextContent('Sound On');

    // Toggle sound
    fireEvent.click(screen.getByTestId('toggle-sound-btn'));

    // Sound should now be disabled
    expect(screen.getByTestId('sound-enabled')).toHaveTextContent('Sound Off');

    // Toggle sound again
    fireEvent.click(screen.getByTestId('toggle-sound-btn'));

    // Sound should be enabled again
    expect(screen.getByTestId('sound-enabled')).toHaveTextContent('Sound On');
  });

  it('saves and loads game state to localStorage', async () => {
    const TestComponentForSaveLoad = () => {
      const { state, actions } = useGame();

      return (
        <div>
          <div data-testid="player-name">
            {state.player ? state.player.name : 'No player'}
          </div>
          <button
            data-testid="create-player-btn"
            onClick={() => actions.setPlayer({ name: 'Original Player' })}
          >
            Create Player
          </button>
          <button
            data-testid="save-game-btn"
            onClick={() => actions.saveGame(1)}
          >
            Save Game
          </button>
          <button
            data-testid="load-game-btn"
            onClick={() => actions.loadGame(1)}
          >
            Load Game
          </button>
          <button
            data-testid="change-name-btn"
            onClick={() => actions.setPlayer({ name: 'Changed Player' })}
          >
            Change Name
          </button>
        </div>
      );
    };

    // First render - create a player and save the game
    const { unmount } = render(
      <GameProvider>
        <TestComponentForSaveLoad />
      </GameProvider>
    );

    // Create original player
    fireEvent.click(screen.getByTestId('create-player-btn'));
    expect(screen.getByTestId('player-name')).toHaveTextContent('Original Player');

    // Save the game
    await act(async () => {
      fireEvent.click(screen.getByTestId('save-game-btn'));
    });

    // Verify localStorage was called with the right data
    const savedData = localStorageMock.getItem('slot1');
    expect(savedData).toBeTruthy();
    expect(JSON.parse(savedData!).player.name).toBe('Original Player');

    // Change player name
    fireEvent.click(screen.getByTestId('change-name-btn'));
    expect(screen.getByTestId('player-name')).toHaveTextContent('Changed Player');

    // Load the saved game - should restore original player
    await act(async () => {
      fireEvent.click(screen.getByTestId('load-game-btn'));
    });

    // Name should be back to original
    expect(screen.getByTestId('player-name')).toHaveTextContent('Original Player');
  });

  it('throws an error when useGame is used outside of GameProvider', () => {
    // Silence console.error for this test to avoid noisy output
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Attempt to use useGame outside of GameProvider
    expect(() => {
      renderHook(() => useGame());
    }).toThrow('useGame must be used within a GameProvider');

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('updates player stats', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => <GameProvider>{children}</GameProvider>
    });

    // Set initial player
    act(() => {
      result.current.actions.setPlayer({
        name: 'Test Player',
        stats: {
          str: 10,
          dex: 10,
          int: 10,
          will: 10,
          luck: 10
        }
      });
    });

    // Verify initial stats
    expect(result.current.state.player?.stats.str).toBe(10);

    // Update player stats
    act(() => {
      result.current.actions.updatePlayer({
        stats: {
          str: 15,
          dex: 10,
          int: 10,
          will: 10,
          luck: 10
        }
      });
    });

    // Verify stats were updated
    expect(result.current.state.player?.stats.str).toBe(15);
  });

  it('handles item management', () => {
    const mockItem = {
      id: 'test_item',
      name: 'Test Item',
      type: 'weapon',
      slot: 'weapon',
      isEquipped: false,
      getValue: () => 100,
      getColor: () => '#FFFFFF',
      getDisplayName: () => '<span>Test Item</span>',
      getTooltip: () => '<div>Test Item</div>',
      use: vi.fn(),
      clone: vi.fn().mockReturnThis()
    };

    const { result } = renderHook(() => useGame(), {
      wrapper: ({ children }) => <GameProvider>{children}</GameProvider>
    });

    // Create player first
    act(() => {
      result.current.actions.setPlayer({ name: 'Test Player' });
    });

    // Verify empty inventory
    expect(result.current.state.inventory.length).toBe(0);

    // Add an item
    act(() => {
      result.current.actions.addItem(mockItem);
    });

    // Verify item was added
    expect(result.current.state.inventory.length).toBe(1);
    expect(result.current.state.inventory[0].id).toBe('test_item');

    // Remove the item
    act(() => {
      result.current.actions.removeItem('test_item');
    });

    // Verify item was removed
    expect(result.current.state.inventory.length).toBe(0);
  });
});
