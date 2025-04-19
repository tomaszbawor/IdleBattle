// ItemData.js - Data for different items

import Item, { ItemTypes, ItemRarities, EquipmentSlots } from './Item';

// Item effects
export const ItemEffects = {
  HEALTH_POTION: {
    description: 'Restores health',
    onUse: (target) => {
      const healAmount = 50;
      target.hp = Math.min(target.hp + healAmount, target.maxHp || target.hp);
      return { 
        heal: healAmount, 
        message: `Restored ${healAmount} health.` 
      };
    }
  },

  MANA_POTION: {
    description: 'Restores mana',
    onUse: (target) => {
      const manaAmount = 30;
      target.mp = Math.min(target.mp + manaAmount, target.maxMp || target.mp);
      return { 
        mana: manaAmount, 
        message: `Restored ${manaAmount} mana.` 
      };
    }
  },

  STRENGTH_POTION: {
    description: 'Temporarily increases strength',
    onUse: (target) => {
      const buff = {
        name: 'strength_boost',
        duration: 3,
        effect: (target) => {
          if (target.stats && target.stats.str !== undefined) {
            target.stats.str += 5;
          }
          return { message: 'Strength increased!' };
        }
      };

      if (typeof target.addBuff === 'function') {
        target.addBuff(buff);
      }
      return { 
        message: 'Strength increased for 3 turns.' 
      };
    }
  }
};

// Weapons
export const Weapons = {
  SWORD: new Item({
    id: 'sword_1',
    name: 'Iron Sword',
    description: 'A basic iron sword.',
    type: ItemTypes.WEAPON,
    slot: EquipmentSlots.WEAPON,
    rarity: ItemRarities.COMMON,
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
    type: ItemTypes.WEAPON,
    slot: EquipmentSlots.WEAPON,
    rarity: ItemRarities.UNCOMMON,
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
    type: ItemTypes.WEAPON,
    slot: EquipmentSlots.WEAPON,
    rarity: ItemRarities.UNCOMMON,
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
    type: ItemTypes.WEAPON,
    slot: EquipmentSlots.WEAPON,
    rarity: ItemRarities.RARE,
    level: 10,
    value: 200,
    stats: {
      attack: 8,
      int: 10
    }
  })
};

// Armor
export const Armor = {
  LEATHER: new Item({
    id: 'armor_leather_1',
    name: 'Leather Armor',
    description: 'Light leather armor.',
    type: ItemTypes.ARMOR,
    slot: EquipmentSlots.ARMOR,
    rarity: ItemRarities.COMMON,
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
    type: ItemTypes.ARMOR,
    slot: EquipmentSlots.ARMOR,
    rarity: ItemRarities.UNCOMMON,
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
    type: ItemTypes.ARMOR,
    slot: EquipmentSlots.ARMOR,
    rarity: ItemRarities.RARE,
    level: 10,
    value: 160,
    stats: {
      defence: 20,
      protection: 10
    }
  })
};

// Helmets
export const Helmets = {
  LEATHER_CAP: new Item({
    id: 'helmet_leather_1',
    name: 'Leather Cap',
    description: 'A simple leather cap.',
    type: ItemTypes.HELMET,
    slot: EquipmentSlots.HELMET,
    rarity: ItemRarities.COMMON,
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
    type: ItemTypes.HELMET,
    slot: EquipmentSlots.HELMET,
    rarity: ItemRarities.UNCOMMON,
    level: 5,
    value: 40,
    stats: {
      defence: 5,
      protection: 3
    }
  })
};

// Boots
export const Boots = {
  LEATHER_BOOTS: new Item({
    id: 'boots_leather_1',
    name: 'Leather Boots',
    description: 'Simple leather boots.',
    type: ItemTypes.BOOTS,
    slot: EquipmentSlots.BOOTS,
    rarity: ItemRarities.COMMON,
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
    type: ItemTypes.BOOTS,
    slot: EquipmentSlots.BOOTS,
    rarity: ItemRarities.UNCOMMON,
    level: 5,
    value: 40,
    stats: {
      defence: 5,
      protection: 3
    }
  })
};

// Accessories
export const Accessories = {
  RING_OF_STRENGTH: new Item({
    id: 'ring_strength_1',
    name: 'Ring of Strength',
    description: 'A ring that enhances strength.',
    type: ItemTypes.ACCESSORY,
    slot: EquipmentSlots.ACCESSORY1,
    rarity: ItemRarities.UNCOMMON,
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
    type: ItemTypes.ACCESSORY,
    slot: EquipmentSlots.ACCESSORY1,
    rarity: ItemRarities.UNCOMMON,
    level: 5,
    value: 100,
    stats: {
      protection: 5
    }
  })
};

// Consumables
export const Consumables = {
  HEALTH_POTION: new Item({
    id: 'potion_health_1',
    name: 'Health Potion',
    description: 'Restores 50 health.',
    type: ItemTypes.CONSUMABLE,
    rarity: ItemRarities.COMMON,
    level: 1,
    value: 20,
    effects: [ItemEffects.HEALTH_POTION]
  }),

  MANA_POTION: new Item({
    id: 'potion_mana_1',
    name: 'Mana Potion',
    description: 'Restores 30 mana.',
    type: ItemTypes.CONSUMABLE,
    rarity: ItemRarities.COMMON,
    level: 1,
    value: 20,
    effects: [ItemEffects.MANA_POTION]
  }),

  STRENGTH_POTION: new Item({
    id: 'potion_strength_1',
    name: 'Strength Potion',
    description: 'Temporarily increases strength by 5.',
    type: ItemTypes.CONSUMABLE,
    rarity: ItemRarities.UNCOMMON,
    level: 5,
    value: 50,
    effects: [ItemEffects.STRENGTH_POTION]
  })
};

// All items
export const AllItems = {
  ...Weapons,
  ...Armor,
  ...Helmets,
  ...Boots,
  ...Accessories,
  ...Consumables
};

// Get a random item
export const getRandomItem = (level = 1, rarity = null) => {
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
export const getItemById = (id) => {
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
