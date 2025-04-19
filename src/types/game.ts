// src/types/game.ts
// Core game types for the Idle Battle game

/**
 * Player stats
 */
export interface PlayerStats {
  str: number;
  dex: number;
  int: number;
  will: number;
  luck: number;
}

/**
 * Player equipment
 */
export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  helmet: Item | null;
  boots: Item | null;
  accessory1: Item | null;
  accessory2: Item | null;
  [key: string]: Item | null;
}

/**
 * Buff effect interface
 */
export interface Buff {
  name: string;
  duration: number;
  effect?: (target: any) => void;
}

/**
 * Player data interface
 */
export interface PlayerData {
  name?: string;
  password?: string;
  race?: string;
  age?: number;
  level?: number;
  exp?: number;
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
  money?: number;
  stats?: PlayerStats;
  ageGrowth?: PlayerStats;
  equipment?: Equipment;
  inventory?: Item[];
  skills?: string[];
}

/**
 * Monster data interface
 */
export interface MonsterData {
  id: string;
  name: string;
  level?: number;
  hp?: number;
  attack?: number;
  defence?: number;
  protection?: number;
  crit?: number;
  crit_mul?: number;
  exp?: number;
  money?: number;
  dropRate?: number;
  petDropRate?: number;
  title?: string | null;
  skills?: string[];
  imageUrl?: string | null;
}

/**
 * Pet data interface
 */
export interface PetData {
  id: string;
  name?: string;
  type?: string;
  level?: number;
  exp?: number;
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
  attack?: number;
  defence?: number;
  protection?: number;
  cri?: number;
  crimul?: number;
  skills?: Skill[];
  imageUrl?: string | null;
}

/**
 * Map data interface
 */
export interface MapData {
  id: string;
  name: string;
  x?: number;
  y?: number;
  monsterList?: MonsterData[];
  petList?: PetData[];
  modifier?: number;
  level?: number;
  unlocked?: boolean;
  imageUrl?: string | null;
  description?: string;
  averageCp?: number;
  isAccessible?: (playerLevel: number) => boolean;
}

/**
 * Item types
 */
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'consumable';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type EquipmentSlotType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2';

/**
 * Item data interface
 */
export interface ItemStats {
  [key: string]: number;
}

export interface ItemEffectResult {
  success: boolean;
  message: string;
  value?: number;
  stat?: string;
}

export interface ItemEffect {
  description: string;
  onUse?: (target: any) => ItemEffectResult;
  [key: string]: unknown;
}

export interface ItemData {
  id: string;
  name: string;
  description?: string;
  type: ItemType;
  slot: EquipmentSlotType;
  rarity?: ItemRarity;
  level?: number;
  value?: number;
  stats?: ItemStats;
  effects?: ItemEffect[];
  imageUrl?: string | null;
}

export interface UseResult {
  success: boolean;
  message: string;
  results?: ItemEffectResult[];
}

export interface Item extends ItemData {
  isEquipped: boolean;
  getValue: () => number;
  getColor: () => string;
  getDisplayName: () => string;
  getTooltip: () => string;
  use: (target: any) => UseResult;
  clone: () => Item;
}

/**
 * Skill types
 */
export type SkillType = 'active' | 'passive' | 'buff' | 'debuff';
export type SkillTarget = 'self' | 'enemy' | 'ally' | 'all';

/**
 * Skill effect interface
 */
export interface SkillEffect {
  damage?: number;
  heal?: number;
  message: string;
  [key: string]: any;
}

/**
 * Skill data interface
 */
export interface SkillData {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  target: SkillTarget;
  cooldown?: number;
  manaCost?: number;
  level?: number;
  effect: (user: any, target: any) => SkillEffect;
  imageUrl?: string | null;
}

export interface Skill extends SkillData {
  currentCooldown: number;
  use: (user: any, target: any) => SkillResult;
  reduceCooldown: () => void;
  isReady: () => boolean;
  levelUp: () => void;
}

export interface SkillResult {
  success: boolean;
  message?: string;
  [key: string]: any;
}

/**
 * Battle state interface
 */
export interface BattleState {
  player: any;
  pet: any | null;
  monster: any | null;
  turn: number;
  battleLog: string[];
  isActive: boolean;
  isBossBattle: boolean;
}

/**
 * Game state interface
 */
export interface GameState {
  player: any | null;
  monster: any | null;
  pet: any | null;
  map: MapData | null;
  battle: any | null;
  inventory: Item[];
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

/**
 * Game context actions interface
 */
export interface GameActions {
  setPlayer: (playerData: PlayerData) => void;
  updatePlayer: (updates: Partial<PlayerData>) => void;
  setMonster: (monsterData: MonsterData) => void;
  setPet: (petData: PetData) => void;
  setMap: (map: MapData) => void;
  setBattle: (battleData: { level?: number; isBossBattle?: boolean } | null) => void;
  startBattle: (level?: number, isBossBattle?: boolean) => void;
  processBattleTurn: () => void;
  useSkill: (skillId: string) => void;
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  equipItem: (item: Item) => void;
  unequipItem: (slot: string) => void;
  updateMoney: (amount: number) => void;
  toggleSound: () => void;
  setToggle: (name: string, value: boolean) => void;
  saveGame: (slot: number) => void;
  loadGame: (slot: number) => void;
  getRandomMonster: (level?: number) => MonsterData;
  getRandomPet: () => PetData;
  getRandomItem: (level?: number, rarity?: ItemRarity | null) => Item | null;
}

/**
 * Game context interface
 */
export interface GameContextType {
  state: GameState;
  actions: GameActions;
}
