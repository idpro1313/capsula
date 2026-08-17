import { Bot, session, Context } from 'grammy';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

import { startCommand } from './commands/start.js';
import { menuCommand } from './commands/menu.js';
import { profileCommand } from './commands/profile.js';
import { inventoryCommand } from './commands/inventory.js';
import { capsulesCommand } from './commands/capsules.js';
import { tradeCommand } from './commands/trade.js';
import { gameCommand } from './commands/game.js';
import { helpCommand } from './commands/help.js';

import { handleCallbackQuery } from './handlers/callback.js';
import { handleMessage } from './handlers/message.js';

// Environment
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const PORT = parseInt(process.env.PORT || '3000', 10);
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || '/webhook';
const WEBHOOK_URL = process.env.WEBHOOK_URL || '';

// Database
export const prisma = new PrismaClient();

// Bot
const bot = new Bot(BOT_TOKEN);

// Middleware: Session
bot.use(session({
  initial: () => ({ step: 'none' }),
}));

// Commands
bot.command('start', (ctx) => startCommand(ctx, prisma));
bot.command('menu', (ctx) => menuCommand(ctx));
bot.command('profile', (ctx) => profileCommand(ctx, prisma));
bot.command('inventory', (ctx) => inventoryCommand(ctx, prisma));
bot.command('capsules', (ctx) => capsulesCommand(ctx));
bot.command('trade', (ctx) => tradeCommand(ctx, prisma));
bot.command('game', (ctx) => gameCommand(ctx));
bot.command('help', (ctx) => helpCommand(ctx));

// Callback queries
bot.on('callback_query', (ctx) => handleCallbackQuery(ctx, prisma));

// Message handlers (for interactive flows)
bot.on('message', (ctx) => handleMessage(ctx, prisma));

// Error handler
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Express app for webhook
const app = express();

// Parse JSON for webhook updates
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoint - Telegram sends updates here
app.post(WEBHOOK_PATH, async (req: Request, res: Response) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error handling update:', err);
    res.status(500).json({ ok: false });
  }
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    // Stop bot from processing new updates
    await bot.stop();
    console.log('Bot stopped');
    
    // Close database connection
    await prisma.$disconnect();
    console.log('Database disconnected');
    
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Bot server running on port ${PORT}`);
  console.log(`📡 Webhook path: ${WEBHOOK_PATH}`);
  
  if (WEBHOOK_URL && BOT_TOKEN) {
    // Set webhook for production
    await bot.api.setWebhook(`${WEBHOOK_URL}${WEBHOOK_PATH}`);
    console.log(`🔗 Webhook set to: ${WEBHOOK_URL}${WEBHOOK_PATH}`);
  } else {
    console.log('⚠️  WEBHOOK_URL not set - running without webhook (development mode)');
  }
});

export { app, bot };