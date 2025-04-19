// MonsterData.ts - Data for different monster types

// Define interfaces for monster data and related types
interface MonsterTitle {
  name: string;
  statMultiplier: number;
}

interface MonsterData {
  id: string;
  name: string;
  hp: number;
  attack: number;
  defence: number;
  protection: number;
  crit: number;
  crit_mul: number;
  exp: number;
  money: number;
  dropRate: number;
  petDropRate: number;
  title?: MonsterTitle;
  skills: string[];
}

interface MonsterTitlesMap {
  [key: string]: MonsterTitle;
}

interface MonstersMap {
  [key: string]: MonsterData;
}

// Monster titles (prefixes that modify monster stats)
export const MonsterTitles: MonsterTitlesMap = {
  NORMAL: { name: '', statMultiplier: 1.0 },
  STRONG: { name: 'Strong', statMultiplier: 1.2 },
  TOUGH: { name: 'Tough', statMultiplier: 1.3 },
  ELITE: { name: 'Elite', statMultiplier: 1.5 },
  BOSS: { name: 'Boss', statMultiplier: 2.0 },
  LEGENDARY: { name: 'Legendary', statMultiplier: 3.0 }
};

// Basic monster types
export const monsters: MonstersMap = {
  GOBLIN: {
    id: 'goblin',
    name: 'Goblin',
    hp: 50,
    attack: 8,
    defence: 3,
    protection: 0,
    crit: 5,
    crit_mul: 150,
    exp: 10,
    money: 5,
    dropRate: 0.1,
    petDropRate: 0.01,
    skills: []
  },
  WOLF: {
    id: 'wolf',
    name: 'Wolf',
    hp: 40,
    attack: 12,
    defence: 2,
    protection: 0,
    crit: 10,
    crit_mul: 150,
    exp: 12,
    money: 3,
    dropRate: 0.08,
    petDropRate: 0.02,
    skills: []
  },
  SKELETON: {
    id: 'skeleton',
    name: 'Skeleton',
    hp: 60,
    attack: 10,
    defence: 5,
    protection: 2,
    crit: 3,
    crit_mul: 140,
    exp: 15,
    money: 8,
    dropRate: 0.12,
    petDropRate: 0.01,
    skills: []
  },
  ORC: {
    id: 'orc',
    name: 'Orc',
    hp: 80,
    attack: 15,
    defence: 8,
    protection: 3,
    crit: 5,
    crit_mul: 160,
    exp: 20,
    money: 12,
    dropRate: 0.15,
    petDropRate: 0.01,
    skills: []
  },
  TROLL: {
    id: 'troll',
    name: 'Troll',
    hp: 120,
    attack: 20,
    defence: 12,
    protection: 5,
    crit: 3,
    crit_mul: 150,
    exp: 30,
    money: 20,
    dropRate: 0.2,
    petDropRate: 0.02,
    skills: []
  },
  VAMPIRE: {
    id: 'vampire',
    name: 'Vampire',
    hp: 150,
    attack: 25,
    defence: 15,
    protection: 8,
    crit: 12,
    crit_mul: 180,
    exp: 40,
    money: 30,
    dropRate: 0.25,
    petDropRate: 0.03,
    skills: []
  },
  LICH: {
    id: 'lich',
    name: 'Lich',
    hp: 200,
    attack: 30,
    defence: 20,
    protection: 10,
    crit: 15,
    crit_mul: 200,
    exp: 50,
    money: 40,
    dropRate: 0.3,
    petDropRate: 0.04,
    skills: []
  }
};

// Boss monsters
export const bosses: MonstersMap = {
  GOBLIN_KING: {
    id: 'goblin_king',
    name: 'Goblin King',
    hp: 200,
    attack: 25,
    defence: 15,
    protection: 8,
    crit: 10,
    crit_mul: 180,
    exp: 100,
    money: 50,
    dropRate: 0.5,
    petDropRate: 0.1,
    title: MonsterTitles.BOSS,
    skills: []
  },
  DRAGON: {
    id: 'dragon',
    name: 'Dragon',
    hp: 500,
    attack: 50,
    defence: 30,
    protection: 15,
    crit: 15,
    crit_mul: 200,
    exp: 300,
    money: 200,
    dropRate: 0.8,
    petDropRate: 0.2,
    title: MonsterTitles.LEGENDARY,
    skills: []
  }
};

// Function to get a random monster
export const getRandomMonster = (level: number = 1): MonsterData => {
  const monsterValues = Object.values(monsters);
  const index = Math.floor(Math.random() * monsterValues.length);
  const monster = { ...monsterValues[index] };

  // Scale monster stats based on level
  if (level > 1) {
    const scaleFactor = 1 + (level - 1) * 0.1; // 10% increase per level
    monster.hp = Math.floor(monster.hp * scaleFactor);
    monster.attack = Math.floor(monster.attack * scaleFactor);
    monster.defence = Math.floor(monster.defence * scaleFactor);
    monster.exp = Math.floor(monster.exp * scaleFactor);
    monster.money = Math.floor(monster.money * scaleFactor);
  }

  // Randomly apply a title (20% chance)
  if (Math.random() < 0.2) {
    const titles = Object.values(MonsterTitles);
    const title = titles[Math.floor(Math.random() * (titles.length - 2)) + 1]; // Skip NORMAL and LEGENDARY
    monster.title = title;

    // Apply title stat multiplier
    monster.hp = Math.floor(monster.hp * title.statMultiplier);
    monster.attack = Math.floor(monster.attack * title.statMultiplier);
    monster.defence = Math.floor(monster.defence * title.statMultiplier);
    monster.exp = Math.floor(monster.exp * title.statMultiplier);
    monster.money = Math.floor(monster.money * title.statMultiplier);
  }

  return monster;
};

// Function to get a specific boss
export const getBoss = (id?: string): MonsterData => {
  if (id) {
    return bosses[id.toUpperCase()] || Object.values(bosses)[0];
  }
  return Object.values(bosses)[0];
};

export default {
  monsters,
  bosses,
  getRandomMonster,
  getBoss
};