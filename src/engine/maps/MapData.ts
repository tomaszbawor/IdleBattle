// MapData.ts - Data for different maps

import { monsters } from '../monsters/MonsterData';
import { PetTypes } from '../pets/PetData';
import Map from './Map';

// Import the MapData interface from Map.ts
// We need to re-export it since it's not exported from Map.ts
interface Monster {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defence: number;
  exp: number;
  money: number;
  combatPower?: number;
  [key: string]: any;
}

interface Pet {
  id: string;
  name: string;
  [key: string]: any;
}

interface MapData {
  id: string;
  name: string;
  x?: number;
  y?: number;
  monsterList?: Monster[];
  petList?: Pet[];
  modifier?: number;
  level?: number;
  unlocked?: boolean;
  imageUrl?: string | null;
  description?: string;
}

// Map data
export const maps: Record<string, MapData> = {
  TOWN: {
    id: 'town',
    name: 'Town of Beginner',
    x: 85,
    y: 314,
    modifier: 0,
    level: 1,
    unlocked: true,
    description: 'A peaceful town where beginners start their adventure.',
    monsterList: [
      monsters.GOBLIN,
      monsters.WOLF,
      monsters.SKELETON
    ],
    petList: [
      PetTypes.WOLF,
      PetTypes.CAT
    ]
  },
  
  FOREST: {
    id: 'forest',
    name: 'Mysterious Forest',
    x: 200,
    y: 250,
    modifier: 0.1,
    level: 5,
    unlocked: true,
    description: 'A dense forest filled with dangerous creatures.',
    monsterList: [
      monsters.WOLF,
      monsters.ORC,
      monsters.TROLL
    ],
    petList: [
      PetTypes.WOLF,
      PetTypes.BEAR,
      PetTypes.SNAKE
    ]
  },
  
  MOUNTAIN: {
    id: 'mountain',
    name: 'Dragon Mountain',
    x: 350,
    y: 150,
    modifier: 0.2,
    level: 10,
    unlocked: false,
    description: 'A treacherous mountain range, home to powerful dragons.',
    monsterList: [
      monsters.TROLL,
      monsters.DRAGON
    ],
    petList: [
      PetTypes.BEAR,
      PetTypes.BIRD
    ]
  },
  
  CAVE: {
    id: 'cave',
    name: 'Dark Cave',
    x: 150,
    y: 400,
    modifier: 0.15,
    level: 7,
    unlocked: false,
    description: 'A dark cave system filled with undead creatures.',
    monsterList: [
      monsters.SKELETON,
      monsters.GOBLIN_KING
    ],
    petList: [
      PetTypes.SNAKE,
      PetTypes.BAT
    ]
  },
  
  CASTLE: {
    id: 'castle',
    name: 'Abandoned Castle',
    x: 450,
    y: 300,
    modifier: 0.25,
    level: 15,
    unlocked: false,
    description: 'An ancient castle, now home to powerful undead lords.',
    monsterList: [
      monsters.SKELETON,
      monsters.VAMPIRE,
      monsters.LICH
    ],
    petList: [
      PetTypes.BAT,
      PetTypes.GHOST
    ]
  }
};

// Function to get a map by ID
export const getMapById = (id: string): Map => {
  const mapData = maps[id.toUpperCase()] || maps.TOWN;
  return new Map(mapData);
};

// Function to get all maps
export const getAllMaps = (): Map[] => {
  return Object.values(maps).map(mapData => new Map(mapData));
};

// Function to get maps accessible to a player of the given level
export const getAccessibleMaps = (playerLevel: number): Map[] => {
  return getAllMaps().filter(map => map.isAccessible(playerLevel));
};

export default {
  maps,
  getMapById,
  getAllMaps,
  getAccessibleMaps
};