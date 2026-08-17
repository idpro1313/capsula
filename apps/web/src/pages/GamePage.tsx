import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Magnet, Clock, Coffee } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

export function GamePage() {
  const { stars, removeStars, addStars } = useGameStore();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [starPosition, setStarPosition] = useState({ x: 50, y: 50 });
  const [catchedStars, setCatchedStars] = useState<{ x: number; y: number; id: number }[]>([]);
  const [boostMagnet, setBoostMagnet] = useState(false);
  const [boostTime, setBoostTime] = useState(false);

  const STAR_SPAWN_INTERVAL = 800;
  const CATCH_DISTANCE = 30;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameState('ended');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawner = setInterval(() => {
      setStarPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
      });
    }, STAR_SPAWN_INTERVAL);

    return () => clearInterval(spawner);
  }, [gameState, boostMagnet]);

  const startGame = (withMagnet: boolean = false, withTime: boolean = false) => {
    if (withMagnet && stars < 5) return;
    if (withTime && stars < 10) return;

    if (withMagnet) removeStars(5);
    if (withTime) removeStars(10);

    setBoostMagnet(withMagnet);
    setBoostTime(withTime);
    setScore(0);
    setTimeLeft(withTime ? 45 : 30);
    setCatchedStars([]);
    setGameState('playing');
  };

  const catchStar = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const clickX = ((clientX - rect.left) / rect.width) * 100;
    const clickY = ((clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(
      Math.pow(clickX - starPosition.x, 2) + 
      Math.pow(clickY - starPosition.y, 2)
    );

    if (distance < CATCH_DISTANCE) {
      const multiplier = boostMagnet ? 2 : 1;
      setScore((s) => s + multiplier);
      setCatchedStars((stars) => [...stars.slice(-5), { ...starPosition, id: Date.now() }]);
    }
  };

  const calculateReward = useCallback(() => {
    if (score < 50) return { food: 1, message: 'Неплохо!' };
    if (score < 100) return { food: 2, message: 'Хорошо!' };
    return { food: 3, message: 'Отлично!' };
  }, [score]);

  const endGame = () => {
    const reward = calculateReward();
    setGameState('ended');
    // In real app, would add food to inventory
  };

  if (gameState === 'idle') {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="text-accent" />
          Поймай звезду!
        </h2>

        <div className="card text-center py-8">
          <div className="text-6xl mb-4 animate-bounce">⭐</div>
          <h3 className="text-lg font-semibold mb-2">Мини-игра</h3>
          <p className="text-text-secondary text-sm mb-6">
            Лови падающие звёзды!<br />
            Чем больше поймаешь — тем больше еды получишь.
          </p>
        </div>

        {/* Boosts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-secondary">Бусты (покупаются за ⭐)</h4>
          
          <button
            onClick={() => startGame(true, false)}
            disabled={stars < 5}
            className={`w-full card flex items-center gap-4 ${
              stars >= 5 ? 'active:scale-98' : 'opacity-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Magnet className="text-blue-500" size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">🧲 Магнит</div>
              <div className="text-sm text-text-secondary">x2 очки за ловлю</div>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Star size={16} />
              5
            </div>
          </button>

          <button
            onClick={() => startGame(false, true)}
            disabled={stars < 10}
            className={`w-full card flex items-center gap-4 ${
              stars >= 10 ? 'active:scale-98' : 'opacity-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Clock className="text-green-500" size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">⚡ Ускорение</div>
              <div className="text-sm text-text-secondary">+15 секунд времени</div>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Star size={16} />
              10
            </div>
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={() => startGame(false, false)}
          className="btn-accent w-full text-lg py-4"
        >
          Начать игру (30 сек)
        </button>
      </div>
    );
  }

  if (gameState === 'ended') {
    const reward = calculateReward();
    
    return (
      <div className="p-4 space-y-6">
        <div className="card text-center py-8">
          <div className="text-5xl mb-4">
            {score >= 100 ? '🏆' : score >= 50 ? '🎉' : '😊'}
          </div>
          <h3 className="text-xl font-bold mb-2">
            {score >= 100 ? 'Невероятно!' : score >= 50 ? 'Отлично!' : 'Неплохо!'}
          </h3>
          <p className="text-text-secondary mb-4">
            Ты поймал {score} звёзд!
          </p>
          
          <div className="bg-success/20 text-success rounded-xl py-3 px-6 inline-flex items-center gap-2 font-semibold">
            <Coffee size={20} />
            +{reward.food} еда для питомцев
          </div>
        </div>

        <button
          onClick={() => setGameState('idle')}
          className="btn-primary w-full"
        >
          Играть снова
        </button>
      </div>
    );
  }

  // Playing state
  return (
    <div 
      className="h-[calc(100vh-120px)] relative overflow-hidden cursor-pointer"
      onClick={catchStar}
      onTouchStart={catchStar}
    >
      {/* Score & Time */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="card px-4 py-2">
          <div className="text-sm text-text-secondary">Очки</div>
          <div className="text-2xl font-bold flex items-center gap-1">
            <Star className="text-accent" size={20} fill="currentColor" />
            {score}
            {boostMagnet && <span className="text-xs text-blue-400 ml-1">(x2)</span>}
          </div>
        </div>
        
        <div className="card px-4 py-2 text-right">
          <div className="text-sm text-text-secondary">Время</div>
          <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-danger' : ''}`}>
            {timeLeft}с
          </div>
        </div>
      </div>

      {/* Falling Star */}
      <motion.div
        key={starPosition.x + '-' + starPosition.y}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute text-5xl"
        style={{
          left: `${starPosition.x}%`,
          top: `${starPosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        ⭐
      </motion.div>

      {/* Catched stars trail */}
      {catchedStars.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0, opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="card inline-block px-4 py-2 text-sm text-text-secondary">
          Нажми на ⭐ чтобы поймать!
        </div>
      </div>
    </div>
  );
}