import { Star, Calendar, TrendingUp, Users, Award } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

export function ProfilePage() {
  const { stars, user, pets } = useGameStore();

  const totalLevel = pets.reduce((sum, p) => sum + p.level, 0);
  const avgRarity = (pets.filter(p => ['RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].includes(p.rarity)).length / Math.max(1, pets.length) * 100).toFixed(0);

  const stats = [
    { icon: <Star size={20} />, label: 'Баланс', value: `${stars} ⭐`, color: 'text-accent' },
    { icon: <TrendingUp size={20} />, label: 'Всего уровней', value: totalLevel.toString(), color: 'text-primary' },
    { icon: <Users size={20} />, label: 'Питомцев', value: pets.length.toString(), color: 'text-secondary' },
    { icon: <Award size={20} />, label: 'Редкие', value: `${avgRarity}%`, color: 'text-success' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="card text-center py-6">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl">
          {user?.firstName?.[0]?.toUpperCase() || '👤'}
        </div>
        <h2 className="text-xl font-bold">{user?.firstName || 'Игрок'}</h2>
        {user?.username && (
          <p className="text-text-secondary">@{user.username}</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-2 text-accent">
          <Star size={16} />
          <span className="font-semibold">{stars.toLocaleString()} Stars</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="card"
          >
            <div className={`mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Reward */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="text-primary" />
          <h3 className="font-semibold">Ежедневная награда</h3>
        </div>
        <div className="bg-background rounded-xl p-4 text-center">
          <div className="text-sm text-text-secondary mb-1">Заходи каждый день!</div>
          <div className="text-accent font-semibold">+5 ⭐ за вход</div>
          <div className="text-xs text-text-secondary mt-2">
            🔥 Бонус за streak: до +100 ⭐
          </div>
        </div>
      </div>

      {/* Pets Summary */}
      {pets.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">🐾 Мои питомцы</h3>
          <div className="space-y-2">
            {pets.slice(0, 5).map((pet) => (
              <div key={pet.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {pet.type === 'STIRLING' ? '⭐' :
                     pet.type === 'FLAMIKIN' ? '🔥' :
                     pet.type === 'DROPLET' ? '💧' :
                     pet.type === 'GROWLY' ? '🌿' :
                     pet.type === 'SPARKLE' ? '⚡' : '🌙'}
                  </span>
                  <div>
                    <div className="font-medium">{pet.name}</div>
                    <div className="text-xs text-text-secondary">{pet.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">⭐ {pet.level}</div>
                  <div className="text-xs text-text-secondary">{pet.rarity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Placeholder */}
      <div className="card">
        <h3 className="font-semibold mb-3">⚙️ Настройки</h3>
        <div className="space-y-2">
          <button className="w-full text-left py-2 text-text-secondary hover:text-white transition-colors">
            📳 Уведомления
          </button>
          <button className="w-full text-left py-2 text-text-secondary hover:text-white transition-colors">
            🌐 Язык
          </button>
          <button className="w-full text-left py-2 text-text-secondary hover:text-white transition-colors">
            ❓ Помощь
          </button>
        </div>
      </div>
    </div>
  );
}