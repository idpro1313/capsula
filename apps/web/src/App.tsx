import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Users, Gamepad2, User } from 'lucide-react';
import { useGameStore } from './stores/gameStore';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { PetsPage } from './pages/PetsPage';
import { GamePage } from './pages/GamePage';
import { ProfilePage } from './pages/ProfilePage';

type Page = 'home' | 'shop' | 'pets' | 'game' | 'profile';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { stars, pets } = useGameStore();

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Главная' },
    { id: 'shop' as const, icon: ShoppingBag, label: 'Магазин' },
    { id: 'game' as const, icon: Gamepad2, label: 'Игра' },
    { id: 'pets' as const, icon: Users, label: 'Питомцы' },
    { id: 'profile' as const, icon: User, label: 'Профиль' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'shop':
        return <ShopPage />;
      case 'pets':
        return <PetsPage />;
      case 'game':
        return <GamePage />;
      case 'profile':
        return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            КАПСУЛА
          </h1>
          <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-full">
            <span className="text-accent">⭐</span>
            <span className="font-semibold">{stars.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-white/10 px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'text-primary bg-primary/10'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <item.icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}