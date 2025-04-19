// Monster.ts - Base monster class and monster types

// Define interfaces for monster data and related types
interface MonsterData {
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
  skills?: any[];
  imageUrl?: string | null;
}

interface Buff {
  name: string;
  duration: number;
  effect?: (monster: Monster) => void;
}

// Base monster class
class Monster {
  id: string;
  name: string;
  level: number;
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
  title: string | null;
  buffs: Buff[];
  skills: any[];
  imageUrl: string | null;

  constructor(data: MonsterData) {
    this.id = data.id;
    this.name = data.name;
    this.level = data.level || 1;
    this.hp = data.hp || 50;
    this.attack = data.attack || 10;
    this.defence = data.defence || 5;
    this.protection = data.protection || 0;
    this.crit = data.crit || 5;
    this.crit_mul = data.crit_mul || 150; // 150% damage on crit
    this.exp = data.exp || 10;
    this.money = data.money || 5;
    this.dropRate = data.dropRate || 0.1; // 10% chance to drop an item
    this.petDropRate = data.petDropRate || 0.01; // 1% chance to drop a pet
    this.title = data.title || null;
    this.buffs = [];
    this.skills = data.skills || [];
    this.imageUrl = data.imageUrl || null;
  }

  // Check if monster has a specific buff
  hasBuff(buffName: string): boolean {
    return this.buffs.some(buff => buff.name === buffName);
  }

  // Add a buff to the monster
  addBuff(buff: Buff): void {
    this.buffs.push(buff);
  }

  // Remove a buff from the monster
  removeBuff(buffName: string): void {
    this.buffs = this.buffs.filter(buff => buff.name !== buffName);
  }

  // Process all active buffs
  processBuff(): void {
    this.buffs.forEach(buff => {
      buff.duration--;
      if (buff.effect) {
        buff.effect(this);
      }
    });
    // Remove expired buffs
    this.buffs = this.buffs.filter(buff => buff.duration > 0);
  }

  // Calculate combat power (CP) for monster difficulty scaling
  get combatPower(): number {
    return this.attack + this.defence + this.hp / 10;
  }
}

export default Monster;