import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Coffee, ChevronRight, X, Utensils, ToyBrick, Moon } from 'lucide-react';
import { useGameStore, RARITY_CONFIG, PET_CONFIG } from '../stores/gameStore';

export function PetsPage() {
  const { pets, updatePet, inventory } = useGameStore();
  const [selectedPet, setSelectedPet] = useState<typeof pets[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'epic'>('all');

  const filteredPets = pets.filter((pet) => {
    if (filter === 'all') return true;
    if (filter === 'common') return ['COMMON', 'UNCOMMON'].includes(pet.rarity);
    if (filter === 'rare') return ['RARE', 'EPIC'].includes(pet.rarity);
    if (filter === 'epic') return ['LEGENDARY', 'MYTHIC'].includes(pet.rarity);
    return true;
  });

  const handleAction = (action: 'feed' | 'play' | 'rest' | 'wash', pet: typeof pets[0]) => {
    const updates: Partial<typeof pet> = {};
    
    switch (action) {
      case 'feed':
        updates.hunger = Math.min(100, pet.hunger + 20);
        updatePet(pet.id, updates);
        break;
      case 'play':
        updates.happiness = Math.min(100, pet.happiness + 15);
        updatePet(pet.id, updates);
        break;
      case 'rest':
        updates.energy = Math.min(100, pet.energy + 30);
        updatePet(pet.id, updates);
        break;
      case 'wash':
        updates.hunger = Math.min(100, pet.hunger + 10);
        updates.happiness = Math.min(100, pet.happiness + 10);
        updates.energy = Math.min(100, pet.energy + 10);
        updatePet(pet.id, updates);
        break;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🐾 Мои питомцы</h2>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all' as const, label: 'Все' },
          { id: 'common' as const, label: '⚪🟢 Обычные' },
          { id: 'rare' as const, label: '🔵🟣 Редкие' },
          { id: 'epic' as const, label: '🟡🌈 Легенды' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              filter === f.id
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Pets Grid */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredPets.map((pet, i) => (
            <motion.button
              key={pet.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPet(pet)}
              className="card text-left active:scale-95 transition-transform"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">
                  {PET_CONFIG[pet.type as keyof typeof PET_CONFIG]?.emoji || '🐾'}
                </div>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ 
                    backgroundColor: `${RARITY_CONFIG[pet.rarity as keyof typeof RARITY_CONFIG].color}20`,
                    color: RARITY_CONFIG[pet.rarity as keyof typeof RARITY_CONFIG].color
                  }}
                >
                  {RARITY_CONFIG[pet.rarity as keyof typeof RARITY_CONFIG].emoji}
                </span>
              </div>
              
              <div className="font-semibold truncate">{pet.name}</div>
              <div className="text-xs text-text-secondary">{PET_CONFIG[pet.type as keyof typeof PET_CONFIG]?.name}</div>
              
              {/* Mini stats */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <Heart size={12} className="text-danger" />
                  <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-danger rounded-full"
                      style={{ width: `${pet.hunger}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Zap size={12} className="text-accent" />
                  <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${pet.energy}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-text-secondary">
                ⭐ Уровень {pet.level}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">🥚</div>
          <h3 className="font-semibold text-lg mb-1">Пока пусто</h3>
          <p className="text-text-secondary text-sm">
            Открой капсулу, чтобы получить питомца!
          </p>
        </div>
      )}

      {/* Pet Detail Modal */}
      <AnimatePresence>
        {selectedPet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedPet(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="card max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`text-5xl ${
                    selectedPet.rarity === 'LEGENDARY' ? 'rarity-legendary' :
                    selectedPet.rarity === 'EPIC' ? 'rarity-epic' : ''
                  }`}>
                    {PET_CONFIG[selectedPet.type as keyof typeof PET_CONFIG]?.emoji || '🐾'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPet.name}</h3>
                    <p className="text-text-secondary">
                      {PET_CONFIG[selectedPet.type as keyof typeof PET_CONFIG]?.name}
                    </p>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${RARITY_CONFIG[selectedPet.rarity as keyof typeof RARITY_CONFIG].color}20`,
                        color: RARITY_CONFIG[selectedPet.rarity as keyof typeof RARITY_CONFIG].color
                      }}
                    >
                      {RARITY_CONFIG[selectedPet.rarity as keyof typeof RARITY_CONFIG].emoji} {selectedPet.rarity}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPet(null)}
                  className="p-2 hover:bg-surface rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <StatBar 
                  icon={<Coffee size={16} className="text-danger" />}
                  label="Голод"
                  value={selectedPet.hunger}
                  color="bg-danger"
                />
                <StatBar 
                  icon={<Heart size={16} className="text-secondary" />}
                  label="Счастье"
                  value={selectedPet.happiness}
                  color="bg-secondary"
                />
                <StatBar 
                  icon={<Zap size={16} className="text-accent" />}
                  label="Энергия"
                  value={selectedPet.energy}
                  color="bg-accent"
                />
              </div>

              {/* Level & XP */}
              <div className="bg-background rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">Уровень</span>
                  <span className="font-bold">⭐ {selectedPet.level}</span>
                </div>
                <div className="stat-bar">
                  <div 
                    className="stat-fill bg-primary"
                    style={{ width: `${(selectedPet.experience % 100)}%` }}
                  />
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  {selectedPet.experience} / 100 XP до следующего уровня
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-4 gap-2">
                <ActionButton
                  icon={<Utensils size={20} />}
                  label="Покормить"
                  onClick={() => handleAction('feed', selectedPet)}
                  color="danger"
                />
                <ActionButton
                  icon={<ToyBrick size={20} />}
                  label="Поиграть"
                  onClick={() => handleAction('play', selectedPet)}
                  color="secondary"
                />
                <ActionButton
                  icon={<Moon size={20} />}
                  label="Отдохнуть"
                  onClick={() => handleAction('rest', selectedPet)}
                  color="accent"
                />
                <ActionButton
                  icon={<span className="text-lg">🛁</span>}
                  label="Помыть"
                  onClick={() => handleAction('wash', selectedPet)}
                  color="success"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBar({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-text-secondary w-16">{label}</span>
      <div className="flex-1 stat-bar">
        <div 
          className={`stat-fill ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium w-8 text-right">{value}</span>
    </div>
  );
}

function ActionButton({ 
  icon, 
  label, 
  onClick, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    danger: 'bg-danger/20 text-danger hover:bg-danger/30',
    secondary: 'bg-secondary/20 text-secondary hover:bg-secondary/30',
    accent: 'bg-accent/20 text-accent hover:bg-accent/30',
    success: 'bg-success/20 text-success hover:bg-success/30',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95 ${colorClasses[color]}`}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}