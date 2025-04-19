// Pet.ts - Pet implementation

// Define interfaces for pet data and related types
interface PetData {
  id: string;
  name?: string;
  type?: string;
  level?: number;
  exp?: number;
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
  attack?: number;
  defence?: number;
  protection?: number;
  cri?: number;
  crimul?: number;
  skills?: any[];
  imageUrl?: string | null;
}

interface Buff {
  name: string;
  duration: number;
  effect?: (pet: Pet) => void;
}

interface Skill {
  id: string;
  target: string;
  level: number;
}

class Pet {
  id: string;
  name: string;
  type: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defence: number;
  protection: number;
  cri: number; // Critical hit chance
  crimul: number; // Critical hit multiplier (150%)
  skills: Skill[];
  buffs: Buff[];
  imageUrl: string | null;

  constructor(data: PetData) {
    this.id = data.id;
    this.name = data.name || 'Pet';
    this.type = data.type || 'wolf';
    this.level = data.level || 1;
    this.exp = data.exp || 0;
    this.expToNextLevel = this.calculateExpToNextLevel();
    this.hp = data.hp || 30;
    this.maxHp = data.maxHp || 30;
    this.mp = data.mp || 20;
    this.maxMp = data.maxMp || 20;
    this.attack = data.attack || 5;
    this.defence = data.defence || 3;
    this.protection = data.protection || 0;
    this.cri = data.cri || 5;
    this.crimul = data.crimul || 150;
    this.skills = data.skills || [];
    this.buffs = [];
    this.imageUrl = data.imageUrl || null;
  }

  // Calculate experience needed for next level
  calculateExpToNextLevel(): number {
    return this.level * 50;
  }

  // Add experience and check for level up
  addExp(exp: number): number {
    this.exp += exp;
    
    // Check for level up
    while (this.exp >= this.expToNextLevel) {
      this.exp -= this.expToNextLevel;
      this.levelUp();
    }
    
    return this.level;
  }

  // Level up the pet
  levelUp(): number {
    this.level++;
    this.expToNextLevel = this.calculateExpToNextLevel();
    
    // Increase stats
    this.maxHp += 5;
    this.maxMp += 3;
    this.attack += 2;
    this.defence += 1;
    
    // Restore HP and MP
    this.hp = this.maxHp;
    this.mp = this.maxMp;
    
    return this.level;
  }

  // Get all attack skills
  getAttackSkills(): Skill[] {
    return this.skills.filter(skill => skill.target === 'enemy');
  }

  // Get a specific skill by ID
  getSkill(skillId: string): Skill | undefined {
    return this.skills.find(skill => skill.id === skillId);
  }

  // Learn a new skill
  learnSkill(skill: Skill): boolean {
    if (this.getSkill(skill.id)) return false;
    
    this.skills.push(skill);
    return true;
  }

  // Check if pet has a specific buff
  hasBuff(buffName: string): boolean {
    return this.buffs.some(buff => buff.name === buffName);
  }

  // Add a buff to the pet
  addBuff(buff: Buff): void {
    this.buffs.push(buff);
  }

  // Remove a buff from the pet
  removeBuff(buffName: string): void {
    this.buffs = this.buffs.filter(buff => buff.name !== buffName);
  }

  // Process all active buffs
  processBuff(): void {
    this.buffs.forEach(buff => {
      buff.duration--;
      if (buff.effect) {
        buff.effect(this);
      }
    });
    // Remove expired buffs
    this.buffs = this.buffs.filter(buff => buff.duration > 0);
  }

  // Save pet data
  save(): PetData {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      level: this.level,
      exp: this.exp,
      hp: this.hp,
      maxHp: this.maxHp,
      mp: this.mp,
      maxMp: this.maxMp,
      attack: this.attack,
      defence: this.defence,
      protection: this.protection,
      cri: this.cri,
      crimul: this.crimul,
      skills: this.skills.map(skill => ({
        id: skill.id,
        level: skill.level
      })),
      imageUrl: this.imageUrl
    };
  }

  // Load pet data
  static load(data: PetData): Pet {
    return new Pet(data);
  }
}

export default Pet;