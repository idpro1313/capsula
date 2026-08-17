/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#0F0F23',
        surface: '#1A1A2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1AA',
        success: '#10B981',
        danger: '#EF4444',
        // Rarity colors
        rarity: {
          common: '#A1A1AA',
          uncommon: '#22C55E',
          rare: '#3B82F6',
          epic: '#A855F7',
          legendary: '#F59E0B',
          mythic: 'linear-gradient(135deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #96CEB4, #DDA0DD)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-sm': 'bounce 1s infinite 0.2s',
        'pulse-glow': 'pulse-glow 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px) rotate(-2deg)' },
          '75%': { transform: 'translateX(5px) rotate(2deg)' },
        },
        'pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}