import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Initialize Telegram SDK
const initTelegram = async () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Apply theme
    document.documentElement.style.setProperty('--tg-theme-bg-color', '#0F0F23');
    document.documentElement.style.setProperty('--tg-theme-text-color', '#FFFFFF');
  }
};

initTelegram().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Type declaration for Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        platform: string;
        themeParams: Record<string, string>;
      };
    };
  }
}