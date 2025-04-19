import { describe, it, expect, vi, beforeEach } from 'vitest';
import Battle from '../Battle';
import Player from '../Player';
import Pet from '../pets/Pet';
import { getSkillById } from '../skills/SkillData';

// Mock dependencies
vi.mock('../monsters/MonsterData', () => ({
  getRandomMonster: vi.fn().mockReturnValue({
    id: 'goblin',
    name: 'Goblin',
    hp: 50,
    attack: 10,
    defence: 5,
    exp: 20,
    money: 10,
    dropRate: 0.1,
    petDropRate: 0.01,
    skills: []
  }),
  getBoss: vi.fn().mockReturnValue({
    id: 'boss_goblin',
    name: 'Goblin King',
    hp: 200,
    attack: 30,
    defence: 15,
    exp: 100,
    money: 100,
    dropRate: 0.5,
    petDropRate: 0.1,
    skills: ['bite'],
    title: 'Boss'
  })
}));

vi.mock('../skills/SkillData', () => ({
  getSkillById: vi.fn().mockImplementation((skillId) => {
    if (skillId === 'fireball') {
      return {
        id: 'fireball',
        name: 'Fireball',
        use: vi.fn().mockReturnValue({
          success: true,
          message: 'Fireball hits for 20 damage!'
        })
      };
    }
    return null;
  })
}));

describe('Battle', () => {
  let player: Player;
  let pet: Pet | null;
  let battle: Battle;

  beforeEach(() => {
    // Create a player for testing
    player = new Player({
      name: 'TestPlayer',
      level: 5,
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      stats: {
        str: 15,
        dex: 10,
        int: 10,
        will: 10,
        luck: 5
      },
      skills: ['fireball']
    });

    // Create a pet for testing
    pet = new Pet({
      id: 'wolf',
      name: 'TestPet',
      type: 'wolf',
      level: 3,
      hp: 50,
      maxHp: 50,
      attack: 10
    });

    // Initialize battle
    battle = new Battle(player, pet);
  });

  // Test battle initialization
  it('should initialize with the correct player and pet', () => {
    expect(battle.player).toBe(player);
    expect(battle.pet).toBe(pet);
    expect(battle.monster).toBeNull();
    expect(battle.isActive).toBe(false);
    expect(battle.turn).toBe(1);
    expect(battle.battleLog).toEqual([]);
  });

  // Test startBattle method
  it('should start a battle with a normal monster', () => {
    const monster = battle.startBattle(5);

    expect(battle.isActive).toBe(true);
    expect(battle.isBossBattle).toBe(false);
    expect(battle.monster).toBeDefined();
    expect(battle.monster?.name).toBe('Goblin');
    expect(battle.battleLog).toHaveLength(1);
    expect(battle.battleLog[0]).toContain('You encounter a Goblin');
  });

  // Test startBattle method with boss
  it('should start a battle with a boss monster', () => {
    const monster = battle.startBattle(5, true);

    expect(battle.isActive).toBe(true);
    expect(battle.isBossBattle).toBe(true);
    expect(battle.monster).toBeDefined();
    expect(battle.monster?.name).toBe('Goblin King');
    expect(battle.battleLog).toHaveLength(1);
    expect(battle.battleLog[0]).toContain('You encounter a Goblin King');
  });

  // Test processTurn method - player attack
  it('should process player turn correctly', () => {
    // Start a battle
    battle.startBattle(5);

    // Spy on player attack method
    const playerAttackSpy = vi.spyOn(battle, 'playerAttack');
    const petAttackSpy = vi.spyOn(battle, 'petAttack');

    // Initial turn is 1 (player)
    expect(battle.turn).toBe(1);

    // Process turn
    battle.processTurn();

    // Check that player and pet attacked
    expect(playerAttackSpy).toHaveBeenCalledTimes(1);
    expect(petAttackSpy).toHaveBeenCalledTimes(1);

    // Turn should now be -1 (monster)
    expect(battle.turn).toBe(-1);
  });

  // Test processTurn method - monster attack
  it('should process monster turn correctly', () => {
    // Start a battle
    battle.startBattle(5);

    // Set turn to monster
    battle.turn = -1;

    // Spy on monster attack method
    const monsterAttackSpy = vi.spyOn(battle, 'monsterAttack');

    // Process turn
    battle.processTurn();

    // Check that monster attacked
    expect(monsterAttackSpy).toHaveBeenCalledTimes(1);

    // Turn should now be 1 (player)
    expect(battle.turn).toBe(1);
  });

  // Test player winning a battle
  it('should handle player winning a battle', () => {
    // Start a battle
    battle.startBattle(5);

    if (battle.monster) {
      // Set monster HP to a small amount
      battle.monster.hp = 1;
    }

    // Process turn to win
    const result = battle.processTurn();

    // Battle should end with player victory
    expect(battle.isActive).toBe(false);

    // Player should gain exp and money
    expect(player.exp).toBeGreaterThan(0);
    expect(player.money).toBeGreaterThan(0);

    // Check battle log for victory message
    const victoryMessage = battle.battleLog.find(msg => msg.includes('defeated'));
    expect(victoryMessage).toBeDefined();
  });

  // Test player losing a battle
  it('should handle player losing a battle', () => {
    // Start a battle
    battle.startBattle(5);

    // Set player HP to a small amount
    player.hp = 1;

    // Set turn to monster
    battle.turn = -1;

    // Process turn to lose
    const result = battle.processTurn();

    // Battle should end with player defeat
    expect(battle.isActive).toBe(false);

    // Check battle log for defeat message
    const defeatMessage = battle.battleLog.find(msg => msg.includes('defeated by'));
    expect(defeatMessage).toBeDefined();
  });

  // Test skill usage
  it('should correctly use skills', () => {
    // Start a battle
    battle.startBattle(5);

    // Use a skill
    const result = battle.useSkill('fireball');

    // Skill should be used successfully
    expect(result).toBe(true);

    // Check battle log for skill usage message
    const skillMessage = battle.battleLog.find(msg => msg.includes('Fireball'));
    expect(skillMessage).toBeDefined();

    // Check that getSkillById was called
    expect(getSkillById).toHaveBeenCalledWith('fireball');
  });

  // Test battle log
  it('should maintain a limited battle log', () => {
    // Add messages beyond limit
    for (let i = 0; i < 60; i++) {
      battle.addToBattleLog(`Test message ${i}`);
    }

    // Check that log stays within limit (50)
    expect(battle.battleLog.length).toBeLessThanOrEqual(50);

    // First messages should be removed
    expect(battle.battleLog[0]).not.toBe('Test message 0');

    // Last message should be present
    expect(battle.battleLog[battle.battleLog.length - 1]).toBe('Test message 59');
  });
});
