// Map.ts - Map implementation

// Define interfaces for map data and related types
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

class Map {
  id: string;
  name: string;
  x: number;
  y: number;
  monsterList: Monster[];
  petList: Pet[];
  modifier: number;
  level: number;
  unlocked: boolean;
  imageUrl: string | null;
  description: string;
  averageCp: number;

  constructor(data: MapData) {
    this.id = data.id;
    this.name = data.name;
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.monsterList = data.monsterList || [];
    this.petList = data.petList || [];
    this.modifier = data.modifier || 0;
    this.level = data.level || 1;
    this.unlocked = data.unlocked || false;
    this.imageUrl = data.imageUrl || null;
    this.description = data.description || '';
    this.averageCp = this.calculateAverageCp();
  }

  // Calculate the average combat power of monsters in this map
  calculateAverageCp(): number {
    if (this.monsterList.length === 0) return 0;

    // Filter out any undefined monsters before calculating
    const validMonsters = this.monsterList.filter(monster => monster !== undefined);
    if (validMonsters.length === 0) return 0;

    const totalCp = validMonsters.reduce((sum, monster) => {
      return sum + (monster.combatPower || 0);
    }, 0);

    return Math.floor(totalCp / validMonsters.length);
  }

  // Get a random monster from this map
  getRandomMonster(): Monster | null {
    if (this.monsterList.length === 0) return null;

    const index = Math.floor(Math.random() * this.monsterList.length);
    return this.monsterList[index];
  }

  // Get a boss monster from this map
  getBoss(): Monster | null {
    if (this.monsterList.length === 0) return null;

    // In a real implementation, we might have specific boss monsters
    // For now, just return a random monster with increased stats
    const monster = this.getRandomMonster();
    if (!monster) return null;

    // Create a boss version of the monster
    return {
      ...monster,
      name: `Boss ${monster.name}`,
      hp: monster.hp * 2,
      attack: monster.attack * 1.5,
      defence: monster.defence * 1.5,
      exp: monster.exp * 3,
      money: monster.money * 3,
      isBoss: true
    };
  }

  // Get a random pet from this map
  getRandomPet(): Pet | null {
    if (this.petList.length === 0) return null;

    const index = Math.floor(Math.random() * this.petList.length);
    return this.petList[index];
  }

  // Check if this map is accessible to a player of the given level
  isAccessible(playerLevel: number): boolean {
    return this.unlocked && playerLevel >= this.level;
  }
}

export default Map;
