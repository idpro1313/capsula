// Capsula Shared Types

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC',
}

export enum PetType {
  STIRLING = 'STIRLING',
  FLAMIKIN = 'FLAMIKIN',
  DROPLET = 'DROPLET',
  GROWLY = 'GROWLY',
  SPARKLE = 'SPARKLE',
  LUNARIK = 'LUNARIK',
}

export enum ItemType {
  FOOD = 'FOOD',
  TOY = 'TOY',
  BOOST = 'BOOST',
}

export enum TradeStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName: string;
  starsBalance: number;
  createdAt: Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  type: PetType;
  rarity: Rarity;
  generation: number;
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
  evolvedFromId?: string;
  isTradable: boolean;
  createdAt: Date;
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description?: string;
  effect: ItemEffect;
  imageUrl?: string;
  priceStars?: number;
}

export interface ItemEffect {
  stat: 'hunger' | 'happiness' | 'energy';
  value: number;
  duration?: number;
}

export interface Trade {
  id: string;
  sellerId: string;
  petId: string;
  buyerId?: string;
  status: TradeStatus;
  priceStars?: number;
  createdAt: Date;
  completedAt?: Date;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CapsuleOpenResult {
  pet: Pet;
  capsule: CapsuleType;
}

export interface GameSessionResult {
  score: number;
  rewards: {
    food: number;
  };
}

export interface LeaderboardEntry {
  userId: string;
  username?: string;
  firstName: string;
  totalLevel: number;
  bestPetRarity: Rarity;
  rank: number;
}

// Constants
export const RARITY_CHANCES: Record<CapsuleType, { rarity: Rarity; chance: number }[]> = {
  small: [
    { rarity: Rarity.COMMON, chance: 0.70 },
    { rarity: Rarity.UNCOMMON, chance: 0.25 },
    { rarity: Rarity.RARE, chance: 0.05 },
  ],
  medium: [
    { rarity: Rarity.COMMON, chance: 0.60 },
    { rarity: Rarity.UNCOMMON, chance: 0.25 },
    { rarity: Rarity.RARE, chance: 0.12 },
    { rarity: Rarity.EPIC, chance: 0.03 },
  ],
  big: [
    { rarity: Rarity.COMMON, chance: 0.50 },
    { rarity: Rarity.UNCOMMON, chance: 0.30 },
    { rarity: Rarity.RARE, chance: 0.15 },
    { rarity: Rarity.EPIC, chance: 0.04 },
    { rarity: Rarity.LEGENDARY, chance: 0.01 },
  ],
  golden: [
    { rarity: Rarity.RARE, chance: 0.50 },
    { rarity: Rarity.EPIC, chance: 0.35 },
    { rarity: Rarity.LEGENDARY, chance: 0.14 },
    { rarity: Rarity.MYTHIC, chance: 0.01 },
  ],
};

export type CapsuleType = 'small' | 'medium' | 'big' | 'golden';

export const CAPSULE_PRICES: Record<CapsuleType, number> = {
  small: 10,
  medium: 50,
  big: 100,
  golden: 500,
};

export const EVOLUTION_REQUIREMENTS = {
  2: { level: 5, stat: 'hunger', value: 80 },
  3: { level: 15, stat: 'happiness', value: 80 },
  4: { level: 30, stat: 'energy', value: 90 },
  5: { level: 50, stat: 'all', value: 100 },
};