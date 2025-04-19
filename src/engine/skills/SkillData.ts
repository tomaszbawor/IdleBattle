// SkillData.ts - Data for different skills

import {Character, SkillData as ISkillData, SkillTargets, SkillTypes} from './Skill';

// Define interfaces for skill effects and buffs
export interface SkillEffect {
  damage?: number;
  heal?: number;
  message: string;
  [key: string]: any;
}

export interface Target extends Character {
  hp: number;
  maxHp?: number;
  name: string;
  attack?: number;
  attackSpeed?: number;
  defence?: number;
  addBuff: (buff: Buff) => void;
  [key: string]: any;
}

// Buff class for status effects
export class Buff {
  name: string;
  duration: number;
  effect?: (target: Target) => SkillEffect;

  constructor(name: string, duration: number, effect?: (target: Target) => SkillEffect) {
    this.name = name;
    this.duration = duration;
    this.effect = effect;
  }
}

// Player skills
export const PlayerSkills: Record<string, ISkillData> = {
  // Attack skills
  FIREBALL: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launch a ball of fire at the enemy, dealing damage.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 2,
    manaCost: 10,
    effect: (user: Target, target: Target): SkillEffect => {
      const damage = Math.floor(user.stats.int * 1.5);
      target.hp -= damage;
      return { 
        damage, 
        message: `${user.name} casts Fireball, dealing ${damage} damage to ${target.name}!` 
      };
    }
  },

  ICE_SPEAR: {
    id: 'ice_spear',
    name: 'Ice Spear',
    description: 'Launch a spear of ice at the enemy, dealing damage and slowing them.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 3,
    manaCost: 15,
    effect: (user: Target, target: Target): SkillEffect => {
      const damage = Math.floor(user.stats.int * 1.2);
      target.hp -= damage;

      // Apply slow debuff
      const slowBuff = new Buff('frozen', 2, (target: Target) => {
        // Reduce target's attack speed
        if (target.attackSpeed) {
          target.attackSpeed = target.attackSpeed * 0.7;
        }
        return { message: `${target.name} is slowed by the ice!` };
      });

      target.addBuff(slowBuff);

      return { 
        damage, 
        message: `${user.name} casts Ice Spear, dealing ${damage} damage and slowing ${target.name}!` 
      };
    }
  },

  HEAL: {
    id: 'heal',
    name: 'Heal',
    description: 'Restore health to yourself.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.SELF,
    cooldown: 4,
    manaCost: 20,
    effect: (user: Target): SkillEffect => {
      const healAmount = Math.floor(user.stats.int * 2);
      user.hp = Math.min(user.hp + healAmount, user.maxHp || user.hp);
      return { 
        heal: healAmount, 
        message: `${user.name} casts Heal, restoring ${healAmount} health!` 
      };
    }
  },

  SHIELD: {
    id: 'shield',
    name: 'Shield',
    description: 'Create a magical shield that reduces damage taken.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.SELF,
    cooldown: 5,
    manaCost: 25,
    effect: (user: Target): SkillEffect => {
      // Apply shield buff
      const shieldBuff = new Buff('shield', 3, (target: Target) => {
        // Increase target's defense
        if (target.defence) {
          target.defence += Math.floor(user.stats.int * 0.5);
        }
        return { message: `${target.name}'s shield absorbs some damage!` };
      });

      user.addBuff(shieldBuff);

      return { 
        message: `${user.name} casts Shield, creating a protective barrier!` 
      };
    }
  },

  DOUBLE_STRIKE: {
    id: 'double_strike',
    name: 'Double Strike',
    description: 'Attack the enemy twice in quick succession.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 3,
    manaCost: 15,
    effect: (user: Target, target: Target): SkillEffect => {
      const damage1 = Math.floor(user.stats.str * 0.8);
      const damage2 = Math.floor(user.stats.str * 0.8);
      const totalDamage = damage1 + damage2;

      target.hp -= totalDamage;

      return { 
        damage: totalDamage, 
        message: `${user.name} performs Double Strike, dealing ${damage1} and ${damage2} damage to ${target.name}!` 
      };
    }
  }
};

// Monster skills
export const MonsterSkills: Record<string, ISkillData> = {
  BITE: {
    id: 'bite',
    name: 'Bite',
    description: 'Bite the target, dealing damage.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 1,
    effect: (user: Target, target: Target): SkillEffect => {
      const damage = Math.floor((user.attack || 0) * 1.2);
      target.hp -= damage;
      return { 
        damage, 
        message: `${user.name} bites ${target.name}, dealing ${damage} damage!` 
      };
    }
  },

  POISON: {
    id: 'poison',
    name: 'Poison',
    description: 'Poison the target, dealing damage over time.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 4,
    effect: (user: Target, target: Target): SkillEffect => {
      // Apply poison debuff
      const poisonBuff = new Buff('poison', 3, (target: Target) => {
        const poisonDamage = Math.floor((user.attack || 0) * 0.3);
        target.hp -= poisonDamage;
        return { 
          damage: poisonDamage, 
          message: `${target.name} takes ${poisonDamage} poison damage!` 
        };
      });

      target.addBuff(poisonBuff);

      return { 
        message: `${user.name} poisons ${target.name}!` 
      };
    }
  },

  ROAR: {
    id: 'roar',
    name: 'Roar',
    description: 'Roar loudly, reducing the target\'s attack.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 3,
    effect: (user: Target, target: Target): SkillEffect => {
      // Apply weakened debuff
      const weakenedBuff = new Buff('weakened', 2, (target: Target) => {
        if (target.attack) {
          target.attack = Math.floor(target.attack * 0.8);
        }
        return { message: `${target.name} is weakened!` };
      });

      target.addBuff(weakenedBuff);

      return { 
        message: `${user.name} roars at ${target.name}, weakening them!` 
      };
    }
  }
};

// Get a skill by ID
export const getSkillById = (id: string): ISkillData | null => {
  return Object.values(PlayerSkills).find(skill => skill.id === id) || 
         Object.values(MonsterSkills).find(skill => skill.id === id) ||
         null;
};

export default {
  PlayerSkills,
  MonsterSkills,
  getSkillById
};
