import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Package, Sparkles, Crown } from 'lucide-react';
import { useGameStore, RARITY_CONFIG } from '../stores/gameStore';

export function ShopPage() {
  const { stars, removeStars, addPet } = useGameStore();
  const [isOpening, setIsOpening] = useState(false);
  const [openedPet, setOpenedPet] = useState<any>(null);

  const capsules = [
    {
      id: 'small',
      name: 'Малая капсула',
      price: 10,
      description: '1 питомец (Common — Uncommon)',
      rarities: ['COMMON', 'UNCOMMON', 'RARE'],
    },
    {
      id: 'medium',
      name: 'Средняя капсула',
      price: 50,
      description: '3 питомца (Common — Rare)',
      rarities: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC'],
      popular: true,
    },
    {
      id: 'big',
      name: 'Большая капсула',
      price: 100,
      description: '5 питомцев + гарантия Rare',
      rarities: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'],
    },
    {
      id: 'golden',
      name: 'Золотая капсула',
      price: 500,
      description: '1 питомец, гарантия Epic+',
      rarities: ['RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'],
      premium: true,
    },
  ];

  const handleOpenCapsule = (capsuleId: string, price: number) => {
    if (stars < price) return;

    removeStars(price);
    setIsOpening(true);

    // Simulate capsule opening
    setTimeout(() => {
      const pet = generateRandomPet(capsuleId);
      setOpenedPet(pet);
      addPet(pet);
    }, 2000);
  };

  const generateRandomPet = (capsuleId: string) => {
    const types = ['STIRLING', 'FLAMIKIN', 'DROPLET', 'GROWLY', 'SPARKLE', 'LUNARIK'];
    const names: Record<string, string[]> = {
      STIRLING: ['Стелла', 'Звездунчик', 'Люмин', 'Астра'],
      FLAMIKIN: ['Огненёк', 'Пламяк', 'Искорка', 'Эмбер'],
      DROPLET: ['Капелька', 'Волна', 'Росинка', 'Аква'],
      GROWLY: ['Лесовичок', 'Моховичок', 'Дубрав', 'Грибочек'],
      SPARKLE: ['Искорка', 'Электроник', 'Молния', 'Заряд'],
      LUNARIK: ['Лунарик', 'Селена', 'Полумесяц', 'Зенит'],
    };

    const rarityChance = Math.random();
    let cumulative = 0;
    let rarity: keyof typeof RARITY_CONFIG = 'COMMON';

    const chances: Record<string, number> = {
      small: { COMMON: 0.70, UNCOMMON: 0.95, RARE: 1.0 },
      medium: { COMMON: 0.60, UNCOMMON: 0.85, RARE: 0.97, EPIC: 1.0 },
      big: { COMMON: 0.50, UNCOMMON: 0.80, RARE: 0.95, EPIC: 0.99, LEGENDARY: 1.0 },
      golden: { RARE: 0.50, EPIC: 0.85, LEGENDARY: 0.99, MYTHIC: 1.0 },
    };

    const capsChances = chances[capsuleId as keyof typeof chances] || chances.small;

    for (const [r, threshold] of Object.entries(capsChances)) {
      if (rarityChance <= threshold) {
        rarity = r as keyof typeof RARITY_CONFIG;
        break;
      }
    }

    const type = types[Math.floor(Math.random() * types.length)];
    const typeNames = names[type as keyof typeof names];
    const name = typeNames[Math.floor(Math.random() * typeNames.length)];

    return {
      id: crypto.randomUUID(),
      name,
      type,
      rarity,
      level: 1,
      experience: 0,
      hunger: 50,
      happiness: 50,
      energy: 50,
      isTradable: false,
    };
  };

  const closeResult = () => {
    setIsOpening(false);
    setOpenedPet(null);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Package className="text-primary" />
        Магазин капсул
      </h2>

      {/* Balance */}
      <div className="card bg-gradient-to-r from-accent/20 to-primary/20 flex items-center justify-between">
        <div>
          <div className="text-sm text-text-secondary">Твой баланс</div>
          <div className="text-2xl font-bold flex items-center gap-1">
            <Star className="text-accent" size={24} fill="currentColor" />
            {stars.toLocaleString()}
          </div>
        </div>
        <div className="text-right text-sm text-text-secondary">
          1 ⭐ ≈ $0.01
        </div>
      </div>

      {/* Capsules */}
      <div className="space-y-3">
        {capsules.map((capsule, i) => (
          <motion.div
            key={capsule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`card ${capsule.premium ? 'border-accent/50' : capsule.premium ? 'border-primary/50' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                capsule.premium 
                  ? 'from-amber-400 to-amber-600' 
                  : capsule.id === 'big' 
                    ? 'from-blue-500 to-blue-700'
                    : capsule.id === 'medium'
                      ? 'from-green-500 to-green-700'
                      : 'from-gray-500 to-gray-700'
              } flex items-center justify-center text-3xl`}>
                {capsule.premium ? '👑' : '🎁'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{capsule.name}</h3>
                  {capsule.popular && (
                    <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                      Хит
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary">{capsule.description}</p>
                
                <div className="flex gap-1 mt-2">
                  {capsule.rarities.map((r) => (
                    <span 
                      key={r}
                      className="text-sm"
                      style={{ color: RARITY_CONFIG[r as keyof typeof RARITY_CONFIG].color }}
                    >
                      {RARITY_CONFIG[r as keyof typeof RARITY_CONFIG].emoji}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenCapsule(capsule.id, capsule.price)}
                disabled={stars < capsule.price || isOpening}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1 transition-all ${
                  stars >= capsule.price && !isOpening
                    ? 'bg-primary hover:bg-primary/90 text-white active:scale-95'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Star size={16} />
                {capsule.price}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Opening Animation */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl"
            >
              🎁
            </motion.div>
            <p className="absolute bottom-1/3 text-lg font-semibold animate-pulse">
              Открываем...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {openedPet && !isOpening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
            onClick={closeResult}
          >
            <div className="card max-w-sm w-full text-center p-6" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10 }}
                className={`text-7xl mb-4 ${
                  openedPet.rarity === 'LEGENDARY' ? 'rarity-legendary' :
                  openedPet.rarity === 'EPIC' ? 'rarity-epic' :
                  openedPet.rarity === 'RARE' ? 'rarity-rare' :
                  ''
                }`}
              >
                {openedPet.type === 'STIRLING' ? '⭐' :
                 openedPet.type === 'FLAMIKIN' ? '🔥' :
                 openedPet.type === 'DROPLET' ? '💧' :
                 openedPet.type === 'GROWLY' ? '🌿' :
                 openedPet.type === 'SPARKLE' ? '⚡' : '🌙'}
              </motion.div>
              
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                style={{ 
                  backgroundColor: `${RARITY_CONFIG[openedPet.rarity as keyof typeof RARITY_CONFIG].color}20`,
                  color: RARITY_CONFIG[openedPet.rarity as keyof typeof RARITY_CONFIG].color
                }}
              >
                {RARITY_CONFIG[openedPet.rarity as keyof typeof RARITY_CONFIG].emoji} {openedPet.rarity}
              </span>
              
              <h3 className="text-2xl font-bold mb-1">{openedPet.name}</h3>
              <p className="text-text-secondary mb-4">{openedPet.type}</p>
              
              <div className="text-sm text-text-secondary mb-4">
                ⭐ Уровень {openedPet.level}
              </div>
              
              <button onClick={closeResult} className="btn-primary w-full">
                Круто! 🎉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}