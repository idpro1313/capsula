import { motion } from 'framer-motion';
import { Gift, Star, TrendingUp } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

interface HomePageProps {
  onNavigate: (page: 'home' | 'shop' | 'pets' | 'game' | 'profile') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { stars, pets, user } = useGameStore();

  const capsuleOptions = [
    { id: 'small', name: 'Малая', price: 10, count: 1, emoji: '🎁', color: 'from-gray-500 to-gray-600' },
    { id: 'medium', name: 'Средняя', price: 50, count: 3, emoji: '🎁', color: 'from-green-500 to-green-600' },
    { id: 'big', name: 'Большая', price: 100, count: 5, emoji: '🎁', color: 'from-blue-500 to-blue-600' },
    { id: 'golden', name: 'Золотая', price: 500, count: 1, emoji: '👑', color: 'from-amber-400 to-amber-500' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-primary/20 to-secondary/20 text-center"
      >
        <h2 className="text-2xl font-bold mb-1">
          Привет, {user?.firstName || 'Друг'}! 👋
        </h2>
        <p className="text-text-secondary text-sm">
          Готов открыть капсулу и найти редкого питомца?
        </p>
      </motion.div>

      {/* Quick Open */}
      <section>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Gift className="text-primary" size={20} />
          Быстрое открытие
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {capsuleOptions.map((capsule, i) => (
            <motion.button
              key={capsule.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate('shop')}
              className={`card bg-gradient-to-br ${capsule.color} p-4 text-left active:scale-95 transition-transform`}
            >
              <div className="text-3xl mb-2">{capsule.emoji}</div>
              <div className="font-semibold">{capsule.name}</div>
              <div className="text-xs opacity-80">
                {capsule.count} {capsule.count === 1 ? 'питомец' : 'питомца'}
              </div>
              <div className="mt-2 font-bold flex items-center gap-1">
                <Star size={14} className="text-yellow-300" fill="currentColor" />
                {capsule.price}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* My Pets Preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span>🐾</span> Мои питомцы
          </h3>
          <button 
            onClick={() => onNavigate('pets')}
            className="text-primary text-sm font-medium"
          >
            Все →
          </button>
        </div>
        {pets.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {pets.slice(0, 5).map((pet) => (
              <div key={pet.id} className="card min-w-[100px] text-center flex-shrink-0">
                <div className="text-3xl mb-1">
                  {getPetEmoji(pet.type)}
                </div>
                <div className="font-medium text-sm truncate">{pet.name}</div>
                <div className="text-xs text-text-secondary">⭐{pet.level}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <div className="text-4xl mb-2">🥚</div>
            <p className="text-text-secondary">У тебя пока нет питомцев</p>
            <p className="text-sm text-text-secondary">Открой капсулу!</p>
          </div>
        )}
      </section>

      {/* Mini Game CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => onNavigate('game')}
          className="w-full card bg-gradient-to-r from-accent/20 to-accent/5 border-accent/30 p-4 flex items-center gap-4"
        >
          <div className="text-4xl">🎮</div>
          <div className="text-left flex-1">
            <div className="font-semibold">Поймай звезду!</div>
            <div className="text-sm text-text-secondary">Заработай еду для питомцев</div>
          </div>
          <TrendingUp className="text-accent" />
        </button>
      </motion.section>
    </div>
  );
}

function getPetEmoji(type: string): string {
  const emojis: Record<string, string> = {
    STIRLING: '⭐',
    FLAMIKIN: '🔥',
    DROPLET: '💧',
    GROWLY: '🌿',
    SPARKLE: '⚡',
    LUNARIK: '🌙',
  };
  return emojis[type] || '🐾';
}