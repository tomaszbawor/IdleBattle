// src/engine/battle/Battle.ts
import { BattleState, SkillResult } from '@/types/game';
import Monster from '@/engine/monsters/Monster';
import { getRandomMonster, getBoss } from '@/engine/monsters/MonsterData';
import { getSkillById } from '@/engine/skills/SkillData';
import Player from '@/engine/Player';
import Pet from '@/engine/pets/Pet';

/**
 * Battle system implementation
 * Handles combat between player, pet, and monsters
 */
class Battle {
  player: Player;
  pet: Pet | null;
  monster: Monster | null;
  turn: number;
  battleLog: string[];
  isActive: boolean;
  isBossBattle: boolean;

  /**
   * Create a new Battle instance
   * @param player - The player participating in the battle
   * @param pet - The player's pet (if any)
   */
  constructor(player: Player, pet: Pet | null = null) {
    this.player = player;
    this.pet = pet;
    this.monster = null;
    this.turn = 1; // 1 for player, -1 for monster
    this.battleLog = [];
    this.isActive = false;
    this.isBossBattle = false;
  }

  /**
   * Start a new battle
   * @param level - Level to scale the monster to (defaults to 1)
   * @param isBossBattle - Whether this is a boss battle (defaults to false)
   * @returns The monster for the battle
   */
  startBattle(level: number = 1, isBossBattle: boolean = false): Monster {
    this.isActive = true;
    this.isBossBattle = isBossBattle;

    // Generate monster based on level
    if (isBossBattle) {
      const bossData = getBoss();
      this.monster = new Monster(bossData);
    } else {
      const monsterData = getRandomMonster(level);
      this.monster = new Monster(monsterData);
    }

    // Reset turn to player
    this.turn = 1;

    // Clear battle log
    this.battleLog = [];

    // Add battle start message
    this.addToBattleLog(`You encounter a ${this.monster.name}!`);

    return this.monster;
  }

  /**
   * End the current battle
   * @param playerWon - Whether the player won the battle
   * @returns Whether the player won
   */
  endBattle(playerWon: boolean): boolean {
    this.isActive = false;

    if (playerWon && this.monster) {
      // Give rewards
      const exp = this.monster.exp;
      const money = this.monster.money;

      this.player.exp += exp;
      this.player.money += money;

      this.addToBattleLog(`You defeated the ${this.monster.name}!`);
      this.addToBattleLog(`You gained ${exp} experience and ${money} gold.`);

      // Check for level up
      if (this.player.exp >= this.player.expToNextLevel) {
        this.player.levelUp();
        this.addToBattleLog(`You leveled up to level ${this.player.level}!`);
      }

      // Check for item drops
      if (Math.random() < this.monster.dropRate) {
        // In a real implementation, we would generate an item here
        this.addToBattleLog(`The ${this.monster.name} dropped an item!`);
      }

      // Check for pet drops
      if (Math.random() < this.monster.petDropRate) {
        // In a real implementation, we would generate a pet here
        this.addToBattleLog(`You found a pet!`);
      }
    } else if (this.monster) {
      this.addToBattleLog(`You were defeated by the ${this.monster.name}!`);
      // In a real implementation, we might apply some penalty for defeat
    }

    return playerWon;
  }

  /**
   * Process a turn in the battle
   * @returns Whether the battle is continuing
   */
  processTurn(): boolean {
    if (!this.isActive || !this.monster) return false;

    if (this.turn > 0) {
      // Player turn
      this.playerTurn();
    } else {
      // Monster turn
      this.monsterTurn();
    }

    // Check for battle end conditions
    if (this.player.hp <= 0) {
      return this.endBattle(false);
    } else if (this.monster.hp <= 0) {
      return this.endBattle(true);
    }

    // Switch turns
    this.turn *= -1;

    // Process buffs
    if (this.player.buffs) {
      this.player.processBuff();
    }

    if (this.monster.buffs) {
      this.monster.processBuff();
    }

    return true;
  }

  /**
   * Handle the player's turn
   */
  playerTurn(): void {
    // Basic attack
    this.playerAttack();

    // If pet exists, it also attacks
    if (this.pet) {
      this.petAttack();
    }
  }

  /**
   * Handle the monster's turn
   */
  monsterTurn(): void {
    if (!this.monster) return;

    // Check if monster is frozen
    if (this.monster.hasBuff('frozen')) {
      this.addToBattleLog(`${this.monster.name} is frozen and cannot attack!`);
      return;
    }

    // Decide whether to use a skill or basic attack
    if (this.monster.skills && this.monster.skills.length > 0 && Math.random() < 0.3) {
      // Use a random skill
      const skillIndex = Math.floor(Math.random() * this.monster.skills.length);
      const skillId = this.monster.skills[skillIndex];
      const skill = getSkillById(skillId);

      if (skill) {
        const result = skill.use(this.monster, this.player);
        if (result.success) {
          this.addToBattleLog(result.message || '');
        } else {
          // Fallback to basic attack
          this.monsterAttack();
        }
      } else {
        // Fallback to basic attack
        this.monsterAttack();
      }
    } else {
      // Basic attack
      this.monsterAttack();
    }
  }

  /**
   * Execute player's basic attack
   */
  playerAttack(): void {
    if (!this.monster) return;

    // Calculate damage
    const critChance = this.player.stats.luck / 100;
    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit ? 1.5 : 1.0;

    const baseDamage = this.player.stats.str;
    const damage = Math.floor(baseDamage * critMultiplier);

    // Apply damage
    this.monster.hp -= damage;

    // Add to battle log
    if (isCrit) {
      this.addToBattleLog(`You land a critical hit for ${damage} damage!`);
    } else {
      this.addToBattleLog(`You attack for ${damage} damage.`);
    }
  }

  /**
   * Execute pet's basic attack
   */
  petAttack(): void {
    if (!this.pet || !this.monster) return;

    // Calculate damage
    const damage = Math.floor(this.pet.attack);

    // Apply damage
    this.monster.hp -= damage;

    // Add to battle log
    this.addToBattleLog(`Your pet attacks for ${damage} damage.`);
  }

  /**
   * Execute monster's basic attack
   */
  monsterAttack(): void {
    if (!this.monster) return;

    // Decide whether to attack player or pet
    let target: Player | Pet = this.player;
    let targetName = "you";

    if (this.pet && Math.random() < 0.3) {
      target = this.pet;
      targetName = "your pet";
    }

    // Calculate damage
    const critChance = this.monster.crit / 100;
    const isCrit = Math.random() < critChance;
    const critMultiplier = isCrit ? this.monster.crit_mul / 100 : 1.0;

    const baseDamage = this.monster.attack;
    const damage = Math.floor(baseDamage * critMultiplier);

    // Apply damage
    target.hp -= damage;

    // Check if pet's HP is below 0
    if (target === this.pet && target.hp <= 0) {
      this.addToBattleLog(`Your pet has been defeated!`);
      this.pet = null; // Remove the pet from battle
    }

    // Add to battle log
    if (isCrit) {
      this.addToBattleLog(`${this.monster.name} lands a critical hit on ${targetName} for ${damage} damage!`);
    } else {
      this.addToBattleLog(`${this.monster.name} attacks ${targetName} for ${damage} damage.`);
    }
  }

  /**
   * Use a skill
   * @param skillId - The ID of the skill to use
   * @param target - The target of the skill (defaults to the monster)
   * @returns Whether the skill was used successfully
   */
  useSkill(skillId: string, target: Monster | Player | Pet = this.monster): boolean {
    const skill = getSkillById(skillId);

    if (!skill) {
      this.addToBattleLog(`Skill not found!`);
      return false;
    }

    if (!target) {
      this.addToBattleLog(`No target available!`);
      return false;
    }

    const result: SkillResult = skill.use(this.player, target);

    if (result.success) {
      this.addToBattleLog(result.message || '');
      return true;
    } else {
      this.addToBattleLog(result.message || `Failed to use ${skill.name}!`);
      return false;
    }
  }

  /**
   * Add a message to the battle log
   * @param message - The message to add
   * @returns The added message
   */
  addToBattleLog(message: string): string {
    this.battleLog.push(message);

    // Limit log size
    if (this.battleLog.length > 50) {
      this.battleLog.shift();
    }

    return message;
  }

  /**
   * Get the current battle state
   * @returns The current battle state
   */
  getBattleState(): BattleState {
    return {
      player: this.player,
      pet: this.pet,
      monster: this.monster,
      turn: this.turn,
      battleLog: this.battleLog,
      isActive: this.isActive,
      isBossBattle: this.isBossBattle
    };
  }
}

export default Battle;
