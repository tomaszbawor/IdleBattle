import Battle from '@/engine/Battle';
import Monster from '@/engine/monsters/Monster';
import Pet from '@/engine/pets/Pet';
import Player from '@/engine/Player';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {getRandomPet} from "@/engine/pets/PetData.ts";
import {getRandomMonster} from "@/engine/monsters/MonsterData.ts";
import {getRandomItem} from "@/engine/items/ItemData.ts";

// Define types for state
interface GameState {
  player: Player | null;
  monster: Monster | null;
  pet: Pet | null;
  map: any | null;
  battle: Battle | null;
  inventory: any[];
  money: number;
  sound: {
    enabled: boolean;
    volume: number;
  };
  toggles: {
    battle: boolean;
    battleIntro: boolean;
    money: boolean;
    exp: boolean;
    item: boolean;
    other: boolean;
  };
  currentSlot?: number;
}

// Define types for actions
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

// Define types for action payloads
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
  payload: any;
}

interface SetBattleAction {
  type: ActionType.SET_BATTLE;
  payload: Battle;
}

interface AddItemAction {
  type: ActionType.ADD_ITEM;
  payload: any;
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

// Define types for context
interface GameContextType {
  state: GameState;
  actions: {
    setPlayer: (playerData: any) => void;
    updatePlayer: (updates: Partial<Player>) => void;
    setMonster: (monsterData: any) => void;
    setPet: (petData: any) => void;
    setMap: (map: any) => void;
    setBattle: (battleData: { level?: number; isBossBattle?: boolean } | null) => void;
    startBattle: (level?: number, isBossBattle?: boolean) => void;
    processBattleTurn: () => void;
    useSkill: (skillId: string) => void;
    addItem: (item: any) => void;
    removeItem: (itemId: string) => void;
    equipItem: (item: any) => void;
    unequipItem: (slot: string) => void;
    updateMoney: (amount: number) => void;
    toggleSound: () => void;
    setToggle: (name: string, value: boolean) => void;
    saveGame: (slot: number) => void;
    loadGame: (slot: number) => void;
    getRandomMonster: (level?: number) => any;
    getRandomPet: () => any;
    getRandomItem: (level?: number, rarity?: string | null) => any;
  };
}

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

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case ActionType.SET_PLAYER:
      return { ...state, player: action.payload };
    case ActionType.UPDATE_PLAYER:
      return { ...state, player: { ...state.player, ...action.payload } as Player };
    case ActionType.SET_MONSTER:
      return { ...state, monster: action.payload };
    case ActionType.SET_PET:
      return { ...state, pet: action.payload };
    case ActionType.SET_MAP:
      return { ...state, map: action.payload };
    case ActionType.SET_BATTLE:
      return { ...state, battle: action.payload };
    case ActionType.ADD_ITEM:
      return { ...state, inventory: [...state.inventory, action.payload] };
    case ActionType.REMOVE_ITEM:
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
    case ActionType.UPDATE_MONEY:
      return { ...state, money: state.money + action.payload };
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
      //TODO: Save game to localStorage
      //const playerData = state.player ? state.player.save() : null;
      // const petData = state.pet ? state.pet.save() : null;
      //
      // localStorage.setItem(`slot${action.payload.slot}`, JSON.stringify({
      //   player: playerData,
      //   pet: petData,
      //   inventory: state.inventory,
      //   money: state.money,
      //   time: new Date().toLocaleString()
      // }));
      return state;
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
          money: savedGame.money || 0
        };
      }
      return state;
    }
    default:
      return state;
  }
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component props
interface GameProviderProps {
  children: ReactNode;
}

// Provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Actions
  const actions = {
    setPlayer: (playerData: any) => {
      const player = new Player(playerData);
      dispatch({ type: ActionType.SET_PLAYER, payload: player });
    },
    updatePlayer: (updates: Partial<Player>) => dispatch({ type: ActionType.UPDATE_PLAYER, payload: updates }),
    setMonster: (monsterData: any) => {
      const monster = new Monster(monsterData);
      dispatch({ type: ActionType.SET_MONSTER, payload: monster });
    },
    setPet: (petData: any) => {
      const pet = new Pet(petData);
      dispatch({ type: ActionType.SET_PET, payload: pet });
    },
    setMap: (map: any) => dispatch({ type: ActionType.SET_MAP, payload: map }),
    setBattle: (battleData: { level?: number; isBossBattle?: boolean } | null) => {
      const battle = new Battle(state.player, state.pet);
      if (battleData) {
        battle.startBattle(battleData.level || 1, battleData.isBossBattle || false);
      }
      dispatch({ type: ActionType.SET_BATTLE, payload: battle });
    },
    startBattle: (level = 1, isBossBattle = false) => {
      const battle = new Battle(state.player, state.pet);
      battle.startBattle(level, isBossBattle);
      dispatch({ type: ActionType.SET_BATTLE, payload: battle });
    },
    processBattleTurn: () => {
      if (state.battle) {
        state.battle.processTurn();
        dispatch({ type: ActionType.SET_BATTLE, payload: state.battle });
      }
    },
    useSkill: (skillId: string) => {
      if (state.battle) {
        state.battle.useSkill(skillId);
        dispatch({ type: ActionType.SET_BATTLE, payload: state.battle });
      }
    },
    addItem: (item: any) => {
      if (state.player) {
        state.player.addItem(item);
      }
      dispatch({ type: ActionType.ADD_ITEM, payload: item });
    },
    removeItem: (itemId: string) => {
      if (state.player) {
        state.player.removeItem(itemId);
      }
      dispatch({ type: ActionType.REMOVE_ITEM, payload: itemId });
    },
    equipItem: (item: any) => {
      if (state.player) {
        state.player.equip(item);
        dispatch({ type: ActionType.UPDATE_PLAYER, payload: state.player });
      }
    },
    unequipItem: (slot: string) => {
      if (state.player) {
        state.player.unequip(slot);
        dispatch({ type: ActionType.UPDATE_PLAYER, payload: state.player });
      }
    },
    updateMoney: (amount: number) => {
      if (state.player) {
        state.player.money += amount;
      }
      dispatch({ type: ActionType.UPDATE_MONEY, payload: amount });
    },
    toggleSound: () => dispatch({ type: ActionType.TOGGLE_SOUND }),
    setToggle: (name: string, value: boolean) => dispatch({
      type: ActionType.SET_TOGGLE,
      payload: { name, value }
    }),
    saveGame: (slot: number) => dispatch({ type: ActionType.SAVE_GAME, payload: { slot } }),
    loadGame: (slot: number) => dispatch({ type: ActionType.LOAD_GAME, payload: { slot } }),
    getRandomMonster: (level = 1) => getRandomMonster(level),
    getRandomPet: () => getRandomPet(),
    getRandomItem: (level = 1, rarity = null) => getRandomItem(level, rarity)
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
