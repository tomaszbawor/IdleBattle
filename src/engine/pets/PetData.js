// PetData.js - Data for different pet types

// Pet skills
export const PetSkills = {
  BITE: {
    id: 'pet_bite',
    name: 'Bite',
    description: 'The pet bites the enemy, dealing damage.',
    target: 'enemy',
    level: 1,
    getSetArray: () => [120], // Damage percentage
    effect: (pet, target) => {
      const damage = Math.floor(pet.attack * 1.2);
      target.hp -= damage;
      return { 
        damage, 
        message: `${pet.name} bites ${target.name}, dealing ${damage} damage!` 
      };
    }
  },

  HEAL: {
    id: 'pet_heal',
    name: 'Heal',
    description: 'The pet heals you and itself.',
    target: 'ally',
    level: 1,
    getSetArray: () => [5], // Heal amount per level
    effect: (pet, target) => {
      const healAmount = 5 * pet.level;
      target.hp = Math.min(target.hp + healAmount, target.maxHp);
      pet.hp = Math.min(pet.hp + healAmount, pet.maxHp);
      return { 
        heal: healAmount, 
        message: `${pet.name} heals you and itself for ${healAmount} HP!` 
      };
    }
  },

  DOUBLE_HIT: {
    id: 'pet_double_hit',
    name: 'Double Hit',
    description: 'The pet attacks twice in quick succession.',
    target: 'enemy',
    level: 1,
    getSetArray: () => [30], // Chance percentage
    effect: (pet, target) => {
      const damage1 = Math.floor(pet.attack * 0.7);
      const damage2 = Math.floor(pet.attack * 0.7);
      const totalDamage = damage1 + damage2;

      target.hp -= totalDamage;

      return { 
        damage: totalDamage, 
        message: `${pet.name} performs Double Hit, dealing ${damage1} and ${damage2} damage to ${target.name}!` 
      };
    }
  },

  TAUNT: {
    id: 'pet_taunt',
    name: 'Taunt',
    description: 'The pet taunts the enemy, making it more likely to attack the pet.',
    target: 'enemy',
    level: 1,
    getSetArray: () => [100], // Taunt chance percentage
    effect: (pet, target) => {
      return { 
        message: `${pet.name} taunts ${target.name}!` 
      };
    }
  },

  DODGE: {
    id: 'pet_dodge',
    name: 'Dodge',
    description: 'The pet has a chance to dodge attacks.',
    target: 'self',
    level: 1,
    getSetArray: () => [20], // Dodge chance percentage
    effect: (pet) => {
      return { 
        message: `${pet.name} prepares to dodge!` 
      };
    }
  }
};

// Pet types
export const PetTypes = {
  WOLF: {
    id: 'wolf',
    name: 'Wolf',
    hp: 40,
    mp: 10,
    attack: 8,
    defence: 3,
    protection: 0,
    cri: 10,
    crimul: 150,
    skills: [PetSkills.BITE, PetSkills.DOUBLE_HIT],
    description: 'A loyal wolf companion with high attack and critical hit chance.'
  },

  CAT: {
    id: 'cat',
    name: 'Cat',
    hp: 30,
    mp: 20,
    attack: 6,
    defence: 2,
    protection: 0,
    cri: 15,
    crimul: 170,
    skills: [PetSkills.BITE, PetSkills.DODGE],
    description: 'A nimble cat with high critical hit chance and the ability to dodge attacks.'
  },

  BEAR: {
    id: 'bear',
    name: 'Bear',
    hp: 60,
    mp: 5,
    attack: 10,
    defence: 5,
    protection: 2,
    cri: 5,
    crimul: 150,
    skills: [PetSkills.BITE, PetSkills.TAUNT],
    description: 'A strong bear with high HP and defense, capable of taunting enemies.'
  },

  BIRD: {
    id: 'bird',
    name: 'Bird',
    hp: 25,
    mp: 30,
    attack: 5,
    defence: 1,
    protection: 0,
    cri: 8,
    crimul: 160,
    skills: [PetSkills.BITE, PetSkills.HEAL],
    description: 'A magical bird with healing abilities and high MP.'
  },

  SNAKE: {
    id: 'snake',
    name: 'Snake',
    hp: 35,
    mp: 15,
    attack: 7,
    defence: 2,
    protection: 1,
    cri: 12,
    crimul: 160,
    skills: [PetSkills.BITE, PetSkills.DODGE],
    description: 'A venomous snake with high critical hit chance and the ability to dodge attacks.'
  },

  BAT: {
    id: 'bat',
    name: 'Bat',
    hp: 30,
    mp: 25,
    attack: 6,
    defence: 2,
    protection: 0,
    cri: 10,
    crimul: 160,
    skills: [PetSkills.BITE, PetSkills.DODGE],
    description: 'A swift bat with good dodge ability and decent attack.'
  },

  GHOST: {
    id: 'ghost',
    name: 'Ghost',
    hp: 40,
    mp: 40,
    attack: 8,
    defence: 4,
    protection: 5,
    cri: 5,
    crimul: 150,
    skills: [PetSkills.BITE, PetSkills.HEAL],
    description: 'A spectral entity with high MP and the ability to heal.'
  }
};

// Function to get a random pet
export const getRandomPet = () => {
  const petTypes = Object.values(PetTypes);
  const randomIndex = Math.floor(Math.random() * petTypes.length);
  return petTypes[randomIndex];
};

// Function to get a pet by ID
export const getPetById = (id) => {
  return PetTypes[id.toUpperCase()] || PetTypes.WOLF;
};

export default {
  PetSkills,
  PetTypes,
  getRandomPet,
  getPetById
};
