// ItemData.ts - Data for different items

import Item, { ItemType, ItemRarity, EquipmentSlotType, ItemEffect } from './Item';

// Define interfaces for target and effect results
interface Target {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: {
    str: number;
    [key: string]: number;
  };
  addBuff: (buff: any) => void;
  [key: string]: any;
}

interface EffectResult {
  heal?: number;
  mana?: number;
  message: string;
  [key: string]: any;
}

// Item effects
export const ItemEffects: Record<string, ItemEffect> = {
  HEALTH_POTION: {
    description: 'Restores health',
    onUse: (target: Target): EffectResult => {
      const healAmount = 50;
      target.hp = Math.min(target.hp + healAmount, target.maxHp);
      return { 
        heal: healAmount, 
        message: `Restored ${healAmount} health.` 
      };
    }
  },
  
  MANA_POTION: {
    description: 'Restores mana',
    onUse: (target: Target): EffectResult => {
      const manaAmount = 30;
      target.mp = Math.min(target.mp + manaAmount, target.maxMp);
      return { 
        mana: manaAmount, 
        message: `Restored ${manaAmount} mana.` 
      };
    }
  },
  
  STRENGTH_POTION: {
    description: 'Temporarily increases strength',
    onUse: (target: Target): EffectResult => {
      const buff = {
        name: 'strength_boost',
        duration: 3,
        effect: (target: Target) => {
          target.stats.str += 5;
          return { message: 'Strength increased!' };
        }
      };
      
      target.addBuff(buff);
      return { 
        message: 'Strength increased for 3 turns.' 
      };
    }
  }
};

// Weapons
export const Weapons: Record<string, Item> = {
  SWORD: new Item({
    id: 'sword_1',
    name: 'Iron Sword',
    description: 'A basic iron sword.',
    type: ItemType.WEAPON,
    slot: EquipmentSlotType.WEAPON,
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 50,
    stats: {
      attack: 10,
      crit: 5
    }
  }),
  
  AXE: new Item({
    id: 'axe_1',
    name: 'Battle Axe',
    description: 'A heavy battle axe.',
    type: ItemType.WEAPON,
    slot: EquipmentSlotType.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 100,
    stats: {
      attack: 15,
      crit: 3
    }
  }),
  
  BOW: new Item({
    id: 'bow_1',
    name: 'Longbow',
    description: 'A precise longbow.',
    type: ItemType.WEAPON,
    slot: EquipmentSlotType.WEAPON,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 100,
    stats: {
      attack: 12,
      crit: 8
    }
  }),
  
  STAFF: new Item({
    id: 'staff_1',
    name: 'Magic Staff',
    description: 'A staff imbued with magical energy.',
    type: ItemType.WEAPON,
    slot: EquipmentSlotType.WEAPON,
    rarity: ItemRarity.RARE,
    level: 10,
    value: 200,
    stats: {
      attack: 8,
      int: 10
    }
  })
};

// Armor
export const Armor: Record<string, Item> = {
  LEATHER: new Item({
    id: 'armor_leather_1',
    name: 'Leather Armor',
    description: 'Light leather armor.',
    type: ItemType.ARMOR,
    slot: EquipmentSlotType.ARMOR,
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 40,
    stats: {
      defence: 5,
      protection: 2
    }
  }),
  
  CHAINMAIL: new Item({
    id: 'armor_chainmail_1',
    name: 'Chainmail',
    description: 'Medium chainmail armor.',
    type: ItemType.ARMOR,
    slot: EquipmentSlotType.ARMOR,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 80,
    stats: {
      defence: 10,
      protection: 5
    }
  }),
  
  PLATE: new Item({
    id: 'armor_plate_1',
    name: 'Plate Armor',
    description: 'Heavy plate armor.',
    type: ItemType.ARMOR,
    slot: EquipmentSlotType.ARMOR,
    rarity: ItemRarity.RARE,
    level: 10,
    value: 160,
    stats: {
      defence: 20,
      protection: 10
    }
  })
};

// Helmets
export const Helmets: Record<string, Item> = {
  LEATHER_CAP: new Item({
    id: 'helmet_leather_1',
    name: 'Leather Cap',
    description: 'A simple leather cap.',
    type: ItemType.HELMET,
    slot: EquipmentSlotType.HELMET,
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 20,
    stats: {
      defence: 2,
      protection: 1
    }
  }),
  
  IRON_HELMET: new Item({
    id: 'helmet_iron_1',
    name: 'Iron Helmet',
    description: 'A sturdy iron helmet.',
    type: ItemType.HELMET,
    slot: EquipmentSlotType.HELMET,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 40,
    stats: {
      defence: 5,
      protection: 3
    }
  })
};

// Boots
export const Boots: Record<string, Item> = {
  LEATHER_BOOTS: new Item({
    id: 'boots_leather_1',
    name: 'Leather Boots',
    description: 'Simple leather boots.',
    type: ItemType.BOOTS,
    slot: EquipmentSlotType.BOOTS,
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 20,
    stats: {
      defence: 2,
      protection: 1
    }
  }),
  
  IRON_BOOTS: new Item({
    id: 'boots_iron_1',
    name: 'Iron Boots',
    description: 'Heavy iron boots.',
    type: ItemType.BOOTS,
    slot: EquipmentSlotType.BOOTS,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 40,
    stats: {
      defence: 5,
      protection: 3
    }
  })
};

// Accessories
export const Accessories: Record<string, Item> = {
  RING_OF_STRENGTH: new Item({
    id: 'ring_strength_1',
    name: 'Ring of Strength',
    description: 'A ring that enhances strength.',
    type: ItemType.ACCESSORY,
    slot: EquipmentSlotType.ACCESSORY1,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 100,
    stats: {
      str: 5
    }
  }),
  
  AMULET_OF_PROTECTION: new Item({
    id: 'amulet_protection_1',
    name: 'Amulet of Protection',
    description: 'An amulet that enhances protection.',
    type: ItemType.ACCESSORY,
    slot: EquipmentSlotType.ACCESSORY1,
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 100,
    stats: {
      protection: 5
    }
  })
};

// Consumables
export const Consumables: Record<string, Item> = {
  HEALTH_POTION: new Item({
    id: 'potion_health_1',
    name: 'Health Potion',
    description: 'Restores 50 health.',
    type: ItemType.CONSUMABLE,
    slot: EquipmentSlotType.WEAPON, // Consumables don't have a slot, but it's required by the interface
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 20,
    effects: [ItemEffects.HEALTH_POTION]
  }),
  
  MANA_POTION: new Item({
    id: 'potion_mana_1',
    name: 'Mana Potion',
    description: 'Restores 30 mana.',
    type: ItemType.CONSUMABLE,
    slot: EquipmentSlotType.WEAPON, // Consumables don't have a slot, but it's required by the interface
    rarity: ItemRarity.COMMON,
    level: 1,
    value: 20,
    effects: [ItemEffects.MANA_POTION]
  }),
  
  STRENGTH_POTION: new Item({
    id: 'potion_strength_1',
    name: 'Strength Potion',
    description: 'Temporarily increases strength by 5.',
    type: ItemType.CONSUMABLE,
    slot: EquipmentSlotType.WEAPON, // Consumables don't have a slot, but it's required by the interface
    rarity: ItemRarity.UNCOMMON,
    level: 5,
    value: 50,
    effects: [ItemEffects.STRENGTH_POTION]
  })
};

// All items
export const AllItems: Record<string, Item> = {
  ...Weapons,
  ...Armor,
  ...Helmets,
  ...Boots,
  ...Accessories,
  ...Consumables
};

// Get a random item
export const getRandomItem = (level = 1, rarity: ItemRarity | null = null): Item | null => {
  const items = Object.values(AllItems).filter(item => {
    if (rarity && item.rarity !== rarity) {
      return false;
    }
    
    return item.level <= level;
  });
  
  if (items.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex].clone();
};

// Get an item by ID
export const getItemById = (id: string): Item | null => {
  const item = Object.values(AllItems).find(item => item.id === id);
  return item ? item.clone() : null;
};

export default {
  ItemEffects,
  Weapons,
  Armor,
  Helmets,
  Boots,
  Accessories,
  Consumables,
  AllItems,
  getRandomItem,
  getItemById
};