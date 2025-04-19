// src/engine/character/__tests__/Player.test.ts
import { describe, it, expect, vi } from 'vitest';
import Player from '../Player';
import { PlayerData, Item } from '@/types/game';

// Mock item for testing
const mockItem: Item = {
  id: 'test_item_1',
  name: 'Test Sword',
  type: 'weapon',
  slot: 'weapon',
  rarity: 'common',
  level: 1,
  value: 100,
  stats: { attack: 10, crit: 5 },
  isEquipped: false,
  description: 'A test sword',
  effects: [],
  getValue: vi.fn().mockReturnValue(100),
  getColor: vi.fn().mockReturnValue('#FFFFFF'),
  getDisplayName: vi.fn().mockReturnValue('<span>Test Sword</span>'),
  getTooltip: vi.fn().mockReturnValue('<div>Test Sword</div>'),
  use: vi.fn(),
  clone: vi.fn().mockImplementation(() => mockItem)
};

describe('Player', () => {
  // Basic initialization test
  it('should initialize with default values when no data is provided', () => {
    const player = new Player({});

    expect(player.name).toBe('Player');
    expect(player.race).toBe('HUMAN');
    expect(player.level).toBe(1);
    expect(player.hp).toBe(100);
    expect(player.maxHp).toBe(100);
    expect(player.mp).toBe(50);
    expect(player.maxMp).toBe(50);
    expect(player.exp).toBe(0);
    expect(player.expToNextLevel).toBe(100);
    expect(player.money).toBe(0);
  });

  // Test player initialization with custom data
  it('should initialize with provided values', () => {
    const playerData: PlayerData = {
      name: 'TestPlayer',
      race: 'ELF',
      level: 5,
      hp: 200,
      maxHp: 200,
      mp: 100,
      maxMp: 100,
      exp: 150,
      money: 500,
      stats: {
        str: 15,
        dex: 20,
        int: 25,
        will: 10,
        luck: 12
      }
    };

    const player = new Player(playerData);

    expect(player.name).toBe('TestPlayer');
    expect(player.race).toBe('ELF');
    expect(player.level).toBe(5);
    expect(player.hp).toBe(200);
    expect(player.maxHp).toBe(200);
    expect(player.mp).toBe(100);
    expect(player.maxMp).toBe(100);
    expect(player.exp).toBe(150);
    expect(player.expToNextLevel).toBe(500); // level * 100
    expect(player.money).toBe(500);
    expect(player.stats.str).toBe(15);
    expect(player.stats.dex).toBe(20);
    expect(player.stats.int).toBe(25);
    expect(player.stats.will).toBe(10);
    expect(player.stats.luck).toBe(12);
  });

  // Test levelUp method
  it('should correctly level up and increase stats', () => {
    const player = new Player({
      level: 1,
      stats: {
        str: 10,
        dex: 10,
        int: 10,
        will: 10,
        luck: 10
      },
      ageGrowth: {
        str: 4,
        dex: 4,
        int: 4,
        will: 4,
        luck: 4
      }
    });

    const initialHp = player.maxHp;
    const initialMp = player.maxMp;

    player.levelUp();

    expect(player.level).toBe(2);
    expect(player.expToNextLevel).toBe(200); // level * 100

    // Stats increased by 1/4 of ageGrowth
    expect(player.stats.str).toBe(11); // 10 + floor(4/4)
    expect(player.stats.dex).toBe(11);
    expect(player.stats.int).toBe(11);
    expect(player.stats.will).toBe(11);
    expect(player.stats.luck).toBe(11);

    // MaxHP and MaxMP increased
    expect(player.maxHp).toBeGreaterThan(initialHp);
    expect(player.maxMp).toBeGreaterThan(initialMp);

    // HP and MP fully restored
    expect(player.hp).toBe(player.maxHp);
    expect(player.mp).toBe(player.maxMp);
  });

  // Test equip method
  it('should correctly equip an item', () => {
    const player = new Player({});

    // Initially no weapon equipped
    expect(player.equipment.weapon).toBeNull();

    // Equip the item
    const result = player.equip(mockItem);

    expect(result).toBe(true);
    expect(player.equipment.weapon).toEqual(mockItem);
    expect(player.inventory).toHaveLength(0); // Item removed from inventory
  });

  // Test unequip method
  it('should correctly unequip an item', () => {
    const player = new Player({
      equipment: {
        weapon: mockItem,
        armor: null,
        helmet: null,
        boots: null,
        accessory1: null,
        accessory2: null
      }
    });

    // Initial inventory empty
    expect(player.inventory).toHaveLength(0);

    // Unequip the item
    const result = player.unequip('weapon');

    expect(result).toBe(true);
    expect(player.equipment.weapon).toBeNull();
    expect(player.inventory).toHaveLength(1); // Item added to inventory
    expect(player.inventory[0]).toEqual(mockItem);
  });

  // Test addItem and removeItem methods
  it('should correctly add and remove items from inventory', () => {
    const player = new Player({});

    // Add item to inventory
    const addResult = player.addItem(mockItem);

    expect(addResult).toBe(true);
    expect(player.inventory).toHaveLength(1);
    expect(player.inventory[0]).toEqual(mockItem);

    // Remove item from inventory
    const removeResult = player.removeItem(mockItem.id);

    expect(removeResult).toBe(true);
    expect(player.inventory).toHaveLength(0);
  });

  // Test buff methods
  it('should correctly handle buffs', () => {
    const player = new Player({});
    const mockEffect = vi.fn();

    // Add a buff
    const buff = {
      name: 'strength_boost',
      duration: 3,
      effect: mockEffect
    };

    player.addBuff(buff);

    // Check if player has the buff
    expect(player.hasBuff('strength_boost')).toBe(true);

    // Process buff should reduce duration and call effect
    player.processBuff();

    expect(mockEffect).toHaveBeenCalledTimes(1);
    expect(mockEffect).toHaveBeenCalledWith(player);
    expect(player.buffs[0].duration).toBe(2);

    // Remove buff
    player.removeBuff('strength_boost');

    expect(player.hasBuff('strength_boost')).toBe(false);
    expect(player.buffs).toHaveLength(0);
  });

  // Test save and load methods
  it('should correctly save and load player data', () => {
    const originalPlayer = new Player({
      name: 'SavedPlayer',
      level: 5,
      exp: 250,
      money: 1000
    });

    // Save player data
    const savedData = originalPlayer.save();

    // Load player from saved data
    const loadedPlayer = Player.load(savedData);

    // Verify all properties were correctly saved and loaded
    expect(loadedPlayer.name).toBe('SavedPlayer');
    expect(loadedPlayer.level).toBe(5);
    expect(loadedPlayer.exp).toBe(250);
    expect(loadedPlayer.money).toBe(1000);
  });

  // Test stat calculations
  it('should correctly calculate derived stats', () => {
    const player = new Player({
      stats: {
        str: 20,
        dex: 15,
        int: 10,
        will: 25,
        luck: 10
      },
      equipment: {
        weapon: { ...mockItem, stats: { attack: 15, crit: 10 } },
        armor: { ...mockItem, slot: 'armor', stats: { defence: 20, protection: 5 } },
        helmet: { ...mockItem, slot: 'helmet', stats: { defence: 10, protection: 2 } },
        boots: null,
        accessory1: null,
        accessory2: null
      } as any // Using 'as any' for test simplicity
    });

    // Calculate protection (will/5 + equipment bonuses)
    expect(player.calculateProtection()).toBe(5 + 5 + 2); // 5 (will/5) + 5 (armor) + 2 (helmet)

    // Calculate defence (will/2 + equipment bonuses)
    expect(player.calculateDefence()).toBe(12 + 20 + 10); // 12 (will/2) + 20 (armor) + 10 (helmet)

    // Calculate attack (str + weapon.attack)
    expect(player.calculateAttack()).toBe(20 + 15); // 20 (str) + 15 (weapon)

    // Calculate crit (luck/2 + weapon.crit)
    expect(player.calculateCrit()).toBe(5 + 10); // 5 (luck/2) + 10 (weapon)
  });
});
