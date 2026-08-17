import { PrismaClient } from '@prisma/client';
import type { CommandContext } from 'grammy';
import { mainMenuKeyboard, backToMenuKeyboard } from '../keyboards/menu.js';

export async function startCommand(ctx: CommandContext, prisma: PrismaClient) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: BigInt(telegramId),
        username: ctx.from?.username || null,
        firstName: ctx.from?.first_name || 'Друг',
        starsBalance: 50, // Welcome bonus
      },
    });

    await ctx.reply(
      `🎉 Добро пожаловать в КАПСУЛУ!\n\n` +
      `Ты получил(а) 50 ⭐ на старт!\n\n` +
      `Открой свою первую капсулу и найди редкого питомца!`,
      { reply_markup: backToMenuKeyboard },
    );
  } else {
    await ctx.reply(
      `С возвращением, ${user.firstName}! 👋\n\n` +
      `Твой баланс: ${user.starsBalance} ⭐\n\n` +
      `Используй меню ниже:`,
      { reply_markup: mainMenuKeyboard },
    );
  }
}