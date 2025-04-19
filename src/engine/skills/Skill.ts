// Skill.ts - Base skill class and skill types

// Define types for skill data
import {SkillEffect, Target} from "./SkillData.ts";

export type SkillType = 'active' | 'passive' | 'buff' | 'debuff';
export type SkillTarget = 'self' | 'enemy' | 'ally' | 'all';

// Define interfaces for entities
export interface Character {
  mp: number;
  [key: string]: any; // Allow for other properties
}

export interface SkillResult {
  success: boolean;
  message?: string;
  [key: string]: any; // Allow for additional result properties
}

export interface SkillData {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  target: SkillTarget;
  cooldown?: number;
  manaCost?: number;
  level?: number;
  effect: (user: Character, target: Target) => SkillEffect;
  imageUrl?: string | null;
}

// Base skill class
class Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  target: SkillTarget;
  cooldown: number;
  currentCooldown: number;
  manaCost: number;
  level: number;
  effect: (user: Character, target: any) => any;
  imageUrl: string | null;

  constructor(data: SkillData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.type = data.type;
    this.target = data.target;
    this.cooldown = data.cooldown || 0;
    this.currentCooldown = 0;
    this.manaCost = data.manaCost || 0;
    this.level = data.level || 1;
    this.effect = data.effect;
    this.imageUrl = data.imageUrl || null;
  }

  // Use the skill on a target
  use(user: Character, target: any): SkillResult {
    if (this.currentCooldown > 0) {
      return { success: false, message: 'Skill is on cooldown' };
    }

    if (user.mp < this.manaCost) {
      return { success: false, message: 'Not enough mana' };
    }

    // Apply the skill effect
    const result = this.effect(user, target);

    // Consume mana and start cooldown
    user.mp -= this.manaCost;
    this.currentCooldown = this.cooldown;

    return { success: true, ...result };
  }

  // Reduce cooldown by 1 turn
  reduceCooldown(): void {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }

  // Check if skill is ready to use
  isReady(): boolean {
    return this.currentCooldown === 0;
  }

  // Level up the skill
  levelUp(): void {
    this.level++;
    // Skill effects typically scale with level, but this is handled in the effect function
  }
}

// Skill types as constants
export const SkillTypes = {
  ACTIVE: 'active' as SkillType,
  PASSIVE: 'passive' as SkillType,
  BUFF: 'buff' as SkillType,
  DEBUFF: 'debuff' as SkillType
};

// Skill targets as constants
export const SkillTargets = {
  SELF: 'self' as SkillTarget,
  ENEMY: 'enemy' as SkillTarget,
  ALLY: 'ally' as SkillTarget,
  ALL: 'all' as SkillTarget
};

export default Skill;