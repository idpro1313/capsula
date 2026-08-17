import { create } from 'zustand';

export interface Pet {
  id: string;
  name: string;
  type: 'STIRLING' | 'FLAMIKIN' | 'DROPLET' | 'GROWLY' | 'SPARKLE' | 'LUNARIK';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  energy: number;
  isTradable: boolean;
}

export interface Item {
  id: string;
  type: 'FOOD' | 'TOY' | 'BOOST';
  name: string;
  description?: string;
  quantity: number;
}

interface GameState {
  stars: number;
  user: {
    id: string;
    firstName: string;
    username?: string;
  } | null;
  pets: Pet[];
  inventory: Item[];
  
  // Actions
  setUser: (user: GameState['user']) => void;
  setStars: (stars: number) => void;
  addStars: (amount: number) => void;
  removeStars: (amount: number) => void;
  setPets: (pets: Pet[]) => void;
  addPet: (pet: Pet) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  setInventory: (items: Item[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  stars: 50,
  user: null,
  pets: [],
  inventory: [],

  setUser: (user) => set({ user }),
  
  setStars: (stars) => set({ stars }),
  
  addStars: (amount) => set((state) => ({ stars: state.stars + amount })),
  
  removeStars: (amount) => set((state) => ({ 
    stars: Math.max(0, state.stars - amount) 
  })),
  
  setPets: (pets) => set({ pets }),
  
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  
  updatePet: (id, updates) => set((state) => ({
    pets: state.pets.map((p) => p.id === id ? { ...p, ...updates } : p),
  })),
  
  setInventory: (inventory) => set({ inventory }),
}));

// Rarity configuration
export const RARITY_CONFIG = {
  COMMON: { color: '#A1A1AA', emoji: '⚪', chance: 0.60 },
  UNCOMMON: { color: '#22C55E', emoji: '🟢', chance: 0.25 },
  RARE: { color: '#3B82F6', emoji: '🔵', chance: 0.10 },
  EPIC: { color: '#A855F7', emoji: '🟣', chance: 0.04 },
  LEGENDARY: { color: '#F59E0B', emoji: '🟡', chance: 0.01 },
  MYTHIC: { color: '#FF6B6B', emoji: '🌈', chance: 0.001 },
} as const;

// Pet type configuration  
export const PET_CONFIG = {
  STIRLING: { emoji: '⭐', name: 'Стиллинг', element: 'звёздный' },
  FLAMIKIN: { emoji: '🔥', name: 'Флэмкин', element: 'огненный' },
  DROPLET: { emoji: '💧', name: 'Дропли', element: 'водяной' },
  GROWLY: { emoji: '🌿', name: 'Гровли', element: 'лесной' },
  SPARKLE: { emoji: '⚡', name: 'Спаркл', element: 'электрический' },
  LUNARIK: { emoji: '🌙', name: 'Лунарик', element: 'лунный' },
} as const;