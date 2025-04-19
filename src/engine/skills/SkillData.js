// SkillData.js - Data for different skills

import { SkillTypes, SkillTargets } from './Skill';

// Buff class for status effects
export class Buff {
  constructor(name, duration, effect) {
    this.name = name;
    this.duration = duration;
    this.effect = effect;
  }
}

// Player skills
export const PlayerSkills = {
  // Attack skills
  FIREBALL: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Launch a ball of fire at the enemy, dealing damage.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 2,
    manaCost: 10,
    effect: (user, target) => {
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
    effect: (user, target) => {
      const damage = Math.floor(user.stats.int * 1.2);
      target.hp -= damage;

      // Apply slow debuff
      const slowBuff = new Buff('frozen', 2, (target) => {
        // Reduce target's attack speed
        if (target.attackSpeed) {
          target.attackSpeed = target.attackSpeed * 0.7;
        }
        return { message: `${target.name} is slowed by the ice!` };
      });

      if (typeof target.addBuff === 'function') {
        target.addBuff(slowBuff);
      }

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
    effect: (user) => {
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
    effect: (user) => {
      // Apply shield buff
      const shieldBuff = new Buff('shield', 3, (target) => {
        // Increase target's defense
        if (target.defence) {
          target.defence += Math.floor(user.stats.int * 0.5);
        }
        return { message: `${target.name}'s shield absorbs some damage!` };
      });

      if (typeof user.addBuff === 'function') {
        user.addBuff(shieldBuff);
      }

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
    effect: (user, target) => {
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
export const MonsterSkills = {
  BITE: {
    id: 'bite',
    name: 'Bite',
    description: 'Bite the target, dealing damage.',
    type: SkillTypes.ACTIVE,
    target: SkillTargets.ENEMY,
    cooldown: 1,
    effect: (user, target) => {
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
    effect: (user, target) => {
      // Apply poison debuff
      const poisonBuff = new Buff('poison', 3, (target) => {
        const poisonDamage = Math.floor((user.attack || 0) * 0.3);
        target.hp -= poisonDamage;
        return { 
          damage: poisonDamage, 
          message: `${target.name} takes ${poisonDamage} poison damage!` 
        };
      });

      if (typeof target.addBuff === 'function') {
        target.addBuff(poisonBuff);
      }

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
    effect: (user, target) => {
      // Apply weakened debuff
      const weakenedBuff = new Buff('weakened', 2, (target) => {
        if (target.attack) {
          target.attack = Math.floor(target.attack * 0.8);
        }
        return { message: `${target.name} is weakened!` };
      });

      if (typeof target.addBuff === 'function') {
        target.addBuff(weakenedBuff);
      }

      return { 
        message: `${user.name} roars at ${target.name}, weakening them!` 
      };
    }
  }
};

// Get a skill by ID
export const getSkillById = (id) => {
  return Object.values(PlayerSkills).find(skill => skill.id === id) || 
         Object.values(MonsterSkills).find(skill => skill.id === id);
};

export default {
  PlayerSkills,
  MonsterSkills,
  getSkillById
};
