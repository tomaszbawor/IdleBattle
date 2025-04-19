// src/engine/character/Player.ts
import {
  PlayerData,
  PlayerStats,
  Equipment,
  Buff,
  Item
} from '@/types/game';
import { PlayerSkills } from './skills/SkillData';

/**
 * Player character class
 * Represents the player in the game with stats, inventory, and skills
 */
class Player {
  name: string;
  race: string;
  age: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  money: number;
  stats: PlayerStats;
  ageGrowth: PlayerStats;
  equipment: Equipment;
  inventory: Item[];
  skills: string[];
  buffs: Buff[];
  protection: number;
  defence: number;
  attack: number;
  crit: number;
  crit_mul: number;

  /**
   * Create a new Player
   * @param data - Player data to initialize with
   */
  constructor(data: PlayerData) {
    this.name = data.name || 'Player';
    this.race = data.race || 'HUMAN';
    this.age = data.age || 10;
    this.level = data.level || 1;
    this.exp = data.exp || 0;
    this.expToNextLevel = this.calculateExpToNextLevel();
    this.hp = data.hp || 100;
    this.maxHp = data.maxHp || 100;
    this.mp = data.mp || 50;
    this.maxMp = data.maxMp || 50;
    this.money = data.money || 0;
    this.stats = data.stats || {
      str: 10,
      dex: 10,
      int: 10,
      will: 10,
      luck: 10
    };
    this.ageGrowth = data.ageGrowth || {
      str: 2,
      dex: 2,
      int: 2,
      will: 2,
      luck: 2
    };
    this.equipment = data.equipment || {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory1: null,
      accessory2: null
    };
    this.inventory = data.inventory || [];
    this.skills = data.skills || [
      PlayerSkills.FIREBALL.id,
      PlayerSkills.HEAL.id
    ];
    this.buffs = [];

    // Calculate derived stats
    this.protection = this.calculateProtection();
    this.defence = this.calculateDefence();
    this.attack = this.calculateAttack();
    this.crit = this.calculateCrit();
    this.crit_mul = 150; // 150% damage on crit
  }

  /**
   * Calculate experience needed for next level
   * @returns The amount of experience needed to reach the next level
   */
  calculateExpToNextLevel(): number {
    return this.level * 100;
  }

  /**
   * Level up the player
   * @returns The new player level
   */
  levelUp(): number {
    this.level++;
    this.expToNextLevel = this.calculateExpToNextLevel();

    // Increase stats based on age growth (1/4 of age growth per level)
    this.stats.str += Math.floor(this.ageGrowth.str / 4);
    this.stats.dex += Math.floor(this.ageGrowth.dex / 4);
    this.stats.int += Math.floor(this.ageGrowth.int / 4);
    this.stats.will += Math.floor(this.ageGrowth.will / 4);
    this.stats.luck += Math.floor(this.ageGrowth.luck / 4);

    // Increase max HP and MP
    this.maxHp += 10 + Math.floor(this.stats.will / 2);
    this.maxMp += 5 + Math.floor(this.stats.int / 2);

    // Restore HP and MP
    this.hp = this.maxHp;
    this.mp = this.maxMp;

    // Recalculate derived stats
    this.protection = this.calculateProtection();
    this.defence = this.calculateDefence();
    this.attack = this.calculateAttack();
    this.crit = this.calculateCrit();

    return this.level;
  }

  /**
   * Calculate protection from stats and equipment
   * @returns The total protection value
   */
  calculateProtection(): number {
    let protection = Math.floor(this.stats.will / 5);

    // Add equipment bonuses
    if (this.equipment.armor) {
      protection += this.equipment.armor.stats?.protection || 0;
    }
    if (this.equipment.helmet) {
      protection += this.equipment.helmet.stats?.protection || 0;
    }
    if (this.equipment.boots) {
      protection += this.equipment.boots.stats?.protection || 0;
    }

    return protection;
  }

  /**
   * Calculate defence from stats and equipment
   * @returns The total defence value
   */
  calculateDefence(): number {
    let defence = Math.floor(this.stats.will / 2);

    // Add equipment bonuses
    if (this.equipment.armor) {
      defence += this.equipment.armor.stats?.defence || 0;
    }
    if (this.equipment.helmet) {
      defence += this.equipment.helmet.stats?.defence || 0;
    }
    if (this.equipment.boots) {
      defence += this.equipment.boots.stats?.defence || 0;
    }

    return defence;
  }

  /**
   * Calculate attack from stats and equipment
   * @returns The total attack value
   */
  calculateAttack(): number {
    let attack = this.stats.str;

    // Add equipment bonuses
    if (this.equipment.weapon) {
      attack += this.equipment.weapon.stats?.attack || 0;
    }

    return attack;
  }

  /**
   * Calculate critical hit chance from stats and equipment
   * @returns The total critical hit chance
   */
  calculateCrit(): number {
    let crit = Math.floor(this.stats.luck / 2);

    // Add equipment bonuses
    if (this.equipment.weapon) {
      crit += this.equipment.weapon.stats?.crit || 0;
    }
    if (this.equipment.accessory1) {
      crit += this.equipment.accessory1.stats?.crit || 0;
    }
    if (this.equipment.accessory2) {
      crit += this.equipment.accessory2.stats?.crit || 0;
    }

    return crit;
  }

  /**
   * Equip an item
   * @param item - The item to equip
   * @returns true if successful, false otherwise
   */
  equip(item: Item): boolean {
    if (!item || !item.type) return false;

    // Add current equipment to inventory if it exists
    if (this.equipment[item.slot]) {
      this.inventory.push(this.equipment[item.slot]!);
    }

    // Equip the new item
    this.equipment[item.slot] = item;

    // Remove the item from inventory
    this.inventory = this.inventory.filter(i => i.id !== item.id);

    // Recalculate stats
    this.protection = this.calculateProtection();
    this.defence = this.calculateDefence();
    this.attack = this.calculateAttack();
    this.crit = this.calculateCrit();

    return true;
  }

  /**
   * Unequip an item
   * @param slot - The equipment slot to unequip
   * @returns true if successful, false otherwise
   */
  unequip(slot: string): boolean {
    if (!this.equipment[slot]) return false;

    // Add the item to inventory
    this.inventory.push(this.equipment[slot]!);

    // Remove the item from equipment
    this.equipment[slot] = null;

    // Recalculate stats
    this.protection = this.calculateProtection();
    this.defence = this.calculateDefence();
    this.attack = this.calculateAttack();
    this.crit = this.calculateCrit();

    return true;
  }

  /**
   * Add an item to inventory
   * @param item - The item to add
   * @returns true if successful, false otherwise
   */
  addItem(item: Item): boolean {
    if (!item) return false;

    this.inventory.push(item);
    return true;
  }

  /**
   * Remove an item from inventory
   * @param itemId - The ID of the item to remove
   * @returns true if successful, false otherwise
   */
  removeItem(itemId: string): boolean {
    const initialLength = this.inventory.length;
    this.inventory = this.inventory.filter(item => item.id !== itemId);
    return this.inventory.length < initialLength;
  }

  /**
   * Learn a new skill
   * @param skillId - The ID of the skill to learn
   * @returns true if successful, false if already known
   */
  learnSkill(skillId: string): boolean {
    if (this.skills.includes(skillId)) return false;

    this.skills.push(skillId);
    return true;
  }

  /**
   * Check if player has a specific buff
   * @param buffName - The name of the buff to check for
   * @returns true if player has the buff, false otherwise
   */
  hasBuff(buffName: string): boolean {
    return this.buffs.some(buff => buff.name === buffName);
  }

  /**
   * Add a buff to the player
   * @param buff - The buff to add
   */
  addBuff(buff: Buff): void {
    this.buffs.push(buff);
  }

  /**
   * Remove a buff from the player
   * @param buffName - The name of the buff to remove
   */
  removeBuff(buffName: string): void {
    this.buffs = this.buffs.filter(buff => buff.name !== buffName);
  }

  /**
   * Process all active buffs
   */
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

  /**
   * Save player data
   * @returns The player data for saving
   */
  save(): PlayerData {
    return {
      name: this.name,
      race: this.race,
      age: this.age,
      level: this.level,
      exp: this.exp,
      hp: this.hp,
      maxHp: this.maxHp,
      mp: this.mp,
      maxMp: this.maxMp,
      money: this.money,
      stats: { ...this.stats },
      ageGrowth: { ...this.ageGrowth },
      equipment: { ...this.equipment },
      inventory: [...this.inventory],
      skills: [...this.skills]
    };
  }

  /**
   * Load player from saved data
   * @param data - The player data to load
   * @returns A new Player instance
   */
  static load(data: PlayerData): Player {
    return new Player(data);
  }
}

export default Player;
