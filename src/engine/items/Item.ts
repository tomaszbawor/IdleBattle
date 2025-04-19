// Item.ts - Item implementation
import { Character } from '../skills/Skill';

// Define types for item properties
export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'consumable';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type EquipmentSlotType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2';

// Define interfaces for item data
export interface ItemStats {
  [key: string]: number;
}

export interface ItemEffectResult {
  success: boolean;
  message: string;
  value?: number;
  stat?: string;
}

export interface ItemEffect {
  description: string;
  onUse?: (target: Character) => ItemEffectResult;
  [key: string]: unknown;
}

export interface ItemData {
  id: string;
  name: string;
  description?: string;
  type: ItemType;
  slot: EquipmentSlotType;
  rarity?: ItemRarity;
  level?: number;
  value?: number;
  stats?: ItemStats;
  effects?: ItemEffect[];
  imageUrl?: string | null;
}

export interface UseResult {
  success: boolean;
  message: string;
  results?: ItemEffectResult[];
}

// Item class
class Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot: EquipmentSlotType;
  rarity: ItemRarity;
  level: number;
  value: number;
  stats: ItemStats;
  effects: ItemEffect[];
  imageUrl: string | null;
  isEquipped: boolean;

  constructor(data: ItemData) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
    this.type = data.type;
    this.slot = data.slot;
    this.rarity = data.rarity || 'common';
    this.level = data.level || 1;
    this.value = data.value || 10;
    this.stats = data.stats || {};
    this.effects = data.effects || [];
    this.imageUrl = data.imageUrl || null;
    this.isEquipped = false;
  }

  // Get item value based on rarity and level
  getValue(): number {
    const rarityMultiplier: Record<ItemRarity, number> = {
      common: 1,
      uncommon: 2,
      rare: 5,
      epic: 10,
      legendary: 20
    };

    return this.value * (this.level || 1) * (rarityMultiplier[this.rarity] || 1);
  }

  // Get item color based on rarity
  getColor(): string {
    const rarityColors: Record<ItemRarity, string> = {
      common: '#FFFFFF', // White
      uncommon: '#00FF00', // Green
      rare: '#0070DD', // Blue
      epic: '#A335EE', // Purple
      legendary: '#FF8000' // Orange
    };

    return rarityColors[this.rarity] || rarityColors.common;
  }

  // Get item display name with rarity color
  getDisplayName(): string {
    return `<span style="color: ${this.getColor()}">${this.name}</span>`;
  }

  // Get item tooltip
  getTooltip(): string {
    let tooltip = `<div style="color: ${this.getColor()}">${this.name}</div>`;
    tooltip += `<div>${this.type} - ${this.rarity}</div>`;
    tooltip += `<div>Level ${this.level}</div>`;

    if (Object.keys(this.stats).length > 0) {
      tooltip += '<div>Stats:</div>';
      for (const [stat, value] of Object.entries(this.stats)) {
        tooltip += `<div>+${value} ${stat}</div>`;
      }
    }

    if (this.effects.length > 0) {
      tooltip += '<div>Effects:</div>';
      for (const effect of this.effects) {
        tooltip += `<div>${effect.description}</div>`;
      }
    }

    tooltip += `<div>${this.description}</div>`;
    tooltip += `<div>Value: ${this.getValue()} gold</div>`;

    return tooltip;
  }

  // Use the item (for consumables)
  use(target: Character): UseResult {
    if (this.type !== 'consumable') {
      return { success: false, message: 'This item cannot be used.' };
    }

    const results: ItemEffectResult[] = [];

    // Apply effects
    for (const effect of this.effects) {
      if (effect.onUse) {
        const result = effect.onUse(target);
        results.push(result);
      }
    }

    return { 
      success: true, 
      message: `Used ${this.name}.`, 
      results 
    };
  }

  // Clone the item
  clone(): Item {
    return new Item({
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      slot: this.slot,
      rarity: this.rarity,
      level: this.level,
      value: this.value,
      stats: { ...this.stats },
      effects: [...this.effects],
      imageUrl: this.imageUrl
    });
  }
}

// Item types as constants
export const ItemTypes = {
  WEAPON: 'weapon' as ItemType,
  ARMOR: 'armor' as ItemType,
  HELMET: 'helmet' as ItemType,
  BOOTS: 'boots' as ItemType,
  ACCESSORY: 'accessory' as ItemType,
  CONSUMABLE: 'consumable' as ItemType
};

// Item rarities as constants
export const ItemRarities = {
  COMMON: 'common' as ItemRarity,
  UNCOMMON: 'uncommon' as ItemRarity,
  RARE: 'rare' as ItemRarity,
  EPIC: 'epic' as ItemRarity,
  LEGENDARY: 'legendary' as ItemRarity
};

// Equipment slots as constants
export const EquipmentSlots = {
  WEAPON: 'weapon' as EquipmentSlotType,
  ARMOR: 'armor' as EquipmentSlotType,
  HELMET: 'helmet' as EquipmentSlotType,
  BOOTS: 'boots' as EquipmentSlotType,
  ACCESSORY1: 'accessory1' as EquipmentSlotType,
  ACCESSORY2: 'accessory2' as EquipmentSlotType
};

export default Item;
