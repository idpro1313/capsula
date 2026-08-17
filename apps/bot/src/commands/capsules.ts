import { Context, CommandContext } from 'grammy';
import { capsuleSizeKeyboard } from '../keyboards/menu.js';

export async function capsulesCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `🎁 МАГАЗИН КАПСУЛ\n\n` +
    `Выбери размер капсулы:\n\n` +
    `⚪ Малая (10 ⭐)\n` +
    `   → 1 питомец (Common-Uncommon)\n\n` +
    `🟢 Средняя (50 ⭐)\n` +
    `   → 3 питомца (Common-Rare)\n\n` +
    `🔵 Большая (100 ⭐)\n` +
    `   → 5 питомцев + гарантия Rare\n\n` +
    `🟡 Золотая (500 ⭐)\n` +
    `   → 1 питомец, гарантия Epic+\n\n` +
    `Удача — твой лучший друг! 🍀`,
    { reply_markup: capsuleSizeKeyboard },
  );
}