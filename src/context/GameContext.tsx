// src/context/GameContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  GameState,
  GameContextType,
  GameActions,
  PlayerData,
  MonsterData,
  PetData,
  MapData,
  Item,
  ItemRarity
} from '@/types/game';

import Battle from '@/engine/Battle';
import Monster from '@/engine/monsters/Monster';
import Pet from '@/engine/pets/Pet';
import Player from '@/engine/Player';
import { getRandomPet } from "@/engine/pets/PetData";
import { getRandomMonster } from "@/engine/monsters/MonsterData";
import { getRandomItem } from "@/engine/items/ItemData";

// Define action types
enum ActionType {
  SET_PLAYER = 'SET_PLAYER',
  UPDATE_PLAYER = 'UPDATE_PLAYER',
  SET_MONSTER = 'SET_MONSTER',
  SET_PET = 'SET_PET',
  SET_MAP = 'SET_MAP',
  SET_BATTLE = 'SET_BATTLE',
  ADD_ITEM = 'ADD_ITEM',
  REMOVE_ITEM = 'REMOVE_ITEM',
  UPDATE_MONEY = 'UPDATE_MONEY',
  TOGGLE_SOUND = 'TOGGLE_SOUND',
  SET_TOGGLE = 'SET_TOGGLE',
  SAVE_GAME = 'SAVE_GAME',
  LOAD_GAME = 'LOAD_GAME'
}

// Define action interfaces
interface SetPlayerAction {
  type: ActionType.SET_PLAYER;
  payload: Player;
}

interface UpdatePlayerAction {
  type: ActionType.UPDATE_PLAYER;
  payload: Partial<Player>;
}

interface SetMonsterAction {
  type: ActionType.SET_MONSTER;
  payload: Monster;
}

interface SetPetAction {
  type: ActionType.SET_PET;
  payload: Pet;
}

interface SetMapAction {
  type: ActionType.SET_MAP;
  payload: MapData;
}

interface SetBattleAction {
  type: ActionType.SET_BATTLE;
  payload: Battle | null;
}

interface AddItemAction {
  type: ActionType.ADD_ITEM;
  payload: Item;
}

interface RemoveItemAction {
  type: ActionType.REMOVE_ITEM;
  payload: string;
}

interface UpdateMoneyAction {
  type: ActionType.UPDATE_MONEY;
  payload: number;
}

interface ToggleSoundAction {
  type: ActionType.TOGGLE_SOUND;
}

interface SetToggleAction {
  type: ActionType.SET_TOGGLE;
  payload: {
    name: string;
    value: boolean;
  };
}

interface SaveGameAction {
  type: ActionType.SAVE_GAME;
  payload: {
    slot: number;
  };
}

interface LoadGameAction {
  type: ActionType.LOAD_GAME;
  payload: {
    slot: number;
  };
}

type GameAction =
  | SetPlayerAction
  | UpdatePlayerAction
  | SetMonsterAction
  | SetPetAction
  | SetMapAction
  | SetBattleAction
  | AddItemAction
  | RemoveItemAction
  | UpdateMoneyAction
  | ToggleSoundAction
  | SetToggleAction
  | SaveGameAction
  | LoadGameAction;

// Initial state
const initialState: GameState = {
  player: null,
  monster: null,
  pet: null,
  map: null,
  battle: null,
  inventory: [],
  money: 0,
  sound: {
    enabled: true,
    volume: 1.0
  },
  toggles: {
    battle: true,
    battleIntro: true,
    money: true,
    exp: true,
    item: true,
    other: true
  }
};

/**
 * Game state reducer
 * Handles all game state updates
 */
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionType.SET_PLAYER:
      return { ...state, player: action.payload };

    case ActionType.UPDATE_PLAYER:
      if (state.player) {
        const updatedPlayerData = { ...state.player, ...action.payload };
        return { ...state, player: new Player(updatedPlayerData) };
      }
      return state;

    case ActionType.SET_MONSTER:
      return { ...state, monster: action.payload };

    case ActionType.SET_PET:
      return { ...state, pet: action.payload };

    case ActionType.SET_MAP:
      return { ...state, map: action.payload };

    case ActionType.SET_BATTLE:
      return { ...state, battle: action.payload };

    case ActionType.ADD_ITEM:
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };

    case ActionType.REMOVE_ITEM:
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };

    case ActionType.UPDATE_MONEY:
      return {
        ...state,
        money: state.money + action.payload
      };

    case ActionType.TOGGLE_SOUND:
      return {
        ...state,
        sound: {
          ...state.sound,
          enabled: !state.sound.enabled
        }
      };

    case ActionType.SET_TOGGLE:
      return {
        ...state,
        toggles: {
          ...state.toggles,
          [action.payload.name]: action.payload.value
        }
      };

    case ActionType.SAVE_GAME: {
      const playerData = state.player ? state.player.save() : null;
      const petData = state.pet ? state.pet.save() : null;

      localStorage.setItem(`slot${action.payload.slot}`, JSON.stringify({
        player: playerData,
        pet: petData,
        inventory: state.inventory,
        money: state.money,
        time: new Date().toLocaleString()
      }));

      return {
        ...state,
        currentSlot: action.payload.slot
      };
    }

    case ActionType.LOAD_GAME: {
      // Load game from localStorage
      const savedGameStr = localStorage.getItem(`slot${action.payload.slot}`);
      if (savedGameStr) {
        const savedGame = JSON.parse(savedGameStr);
        // Create instances of our classes
        const player = savedGame.player ? new Player(savedGame.player) : null;
        const pet = savedGame.pet ? new Pet(savedGame.pet) : null;

        return {
          ...state,
          player,
          pet,
          inventory: savedGame.inventory || [],
          money: savedGame.money || 0,
          currentSlot: action.payload.slot
        };
      }
      return state;
    }

    default:
      return state;
  }
};

// Create the GameContext
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider props interface
interface GameProviderProps {
  children: ReactNode;
}

/**
 * GameProvider component
 * Provides game state and actions to all child components
 */
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Define all actions
  const actions: GameActions = {
    setPlayer: (playerData: PlayerData) => {
      const player = new Player(playerData);
      dispatch({ type: ActionType.SET_PLAYER, payload: player });
    },

    updatePlayer: (updates: Partial<PlayerData>) => {
      dispatch({ type: ActionType.UPDATE_PLAYER, payload: updates });
    },

    setMonster: (monsterData: MonsterData) => {
      const monster = new Monster(monsterData);
      dispatch({ type: ActionType.SET_MONSTER, payload: monster });
    },

    setPet: (petData: PetData) => {
      const pet = new Pet(petData);
      dispatch({ type: ActionType.SET_PET, payload: pet });
    },

    setMap: (map: MapData) => {
      dispatch({ type: ActionType.SET_MAP, payload: map });
    },

    setBattle: (battleData: { level?: number; isBossBattle?: boolean } | null) => {
      if (!state.player) return;

      if (!battleData) {
        dispatch({ type: ActionType.SET_BATTLE, payload: null });
        return;
      }

      const battle = new Battle(state.player, state.pet);
      const monster = battle.startBattle(battleData.level || 1, battleData.isBossBattle || false);
      dispatch({ type: ActionType.SET_MONSTER, payload: monster });
      dispatch({ type: ActionType.SET_BATTLE, payload: battle });
    },

    startBattle: (level = 1, isBossBattle = false) => {
      if (!state.player) return;

      const battle = new Battle(state.player, state.pet);
      const monster = battle.startBattle(level, isBossBattle);
      dispatch({ type: ActionType.SET_MONSTER, payload: monster });
      dispatch({ type: ActionType.SET_BATTLE, payload: battle });
    },

    processBattleTurn: () => {
      if (state.battle) {
        state.battle.processTurn();
        // Force a re-render by creating a new battle object with the updated state
        dispatch({ type: ActionType.SET_BATTLE, payload: { ...state.battle } });
      }
    },

    useSkill: (skillId: string) => {
      if (state.battle) {
        state.battle.useSkill(skillId);
        // Force a re-render by creating a new battle object with the updated state
        dispatch({ type: ActionType.SET_BATTLE, payload: { ...state.battle } });
      }
    },

    addItem: (item: Item) => {
      if (state.player) {
        // Create a new Player instance with the added item
        const updatedPlayer = new Player(state.player);
        updatedPlayer.addItem(item);
        dispatch({ type: ActionType.SET_PLAYER, payload: updatedPlayer });
      }
      dispatch({ type: ActionType.ADD_ITEM, payload: item });
    },

    removeItem: (itemId: string) => {
      if (state.player) {
        // Create a new Player instance with the item removed
        const updatedPlayer = new Player(state.player);
        updatedPlayer.removeItem(itemId);
        dispatch({ type: ActionType.SET_PLAYER, payload: updatedPlayer });
      }
      dispatch({ type: ActionType.REMOVE_ITEM, payload: itemId });
    },

    equipItem: (item: Item) => {
      if (state.player) {
        const updatedPlayer = new Player(state.player);
        updatedPlayer.equip(item);
        dispatch({ type: ActionType.SET_PLAYER, payload: updatedPlayer });
      }
    },

    unequipItem: (slot: string) => {
      if (state.player) {
        const updatedPlayer = new Player(state.player);
        updatedPlayer.unequip(slot);
        dispatch({ type: ActionType.SET_PLAYER, payload: updatedPlayer });
      }
    },

    updateMoney: (amount: number) => {
      if (state.player) {
        // Create a new Player instance with updated money
        const updatedPlayer = new Player(state.player);
        updatedPlayer.money += amount;
        dispatch({ type: ActionType.SET_PLAYER, payload: updatedPlayer });
      }
      dispatch({ type: ActionType.UPDATE_MONEY, payload: amount });
    },

    toggleSound: () => {
      dispatch({ type: ActionType.TOGGLE_SOUND });
    },

    setToggle: (name: string, value: boolean) => {
      dispatch({
        type: ActionType.SET_TOGGLE,
        payload: { name, value }
      });
    },

    saveGame: (slot: number) => {
      dispatch({ type: ActionType.SAVE_GAME, payload: { slot } });
    },

    loadGame: (slot: number) => {
      dispatch({ type: ActionType.LOAD_GAME, payload: { slot } });
    },

    getRandomMonster: (level = 1) => {
      return getRandomMonster(level);
    },

    getRandomPet: () => {
      return getRandomPet();
    },

    getRandomItem: (level = 1, rarity: ItemRarity | null = null) => {
      return getRandomItem(level, rarity);
    }
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};

/**
 * Custom hook to use the game context
 * @returns The game context with state and actions
 * @throws Error if used outside of a GameProvider
 */
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
