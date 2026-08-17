import { PrismaClient } from '@prisma/client';
import { Context, CommandContext } from 'grammy';

export async function tradeCommand(ctx: CommandContext<Context>, prisma: PrismaClient) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    include: {
      pets: {
        where: { isTradable: true },
        orderBy: { level: 'desc' },
      },
    },
  });

  if (!user) {
    await ctx.reply('❌ Сначала напиши /start');
    return;
  }

  const trades = await prisma.trade.findMany({
    where: { status: 'ACTIVE', sellerId: { not: user.id } },
    include: {
      pet: true,
      seller: { select: { firstName: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  let text = `💱 ТОРГОВЛЯ\n\n`;

  if (user.pets.length > 0) {
    text += `📤 Твои питомцы для обмена:\n`;
    user.pets.slice(0, 5).forEach((pet, i) => {
      text += `${i + 1}. ${pet.name} (${pet.type}) ⭐${pet.level}\n`;
    });
    text += `\n`;
  }

  if (trades.length > 0) {
    text += `📥 Доступные предложения:\n\n`;
    trades.forEach((trade, i) => {
      const price = trade.priceStars ? `${trade.priceStars} ⭐` : '🎁';
      const seller = trade.seller.username || trade.seller.firstName;
      text += `${i + 1}. ${trade.pet.name} от ${seller}\n`;
      text += `   Редкость: ${trade.pet.rarity} | Уровень: ${trade.pet.level}\n`;
      text += `   Цена: ${price}\n\n`;
    });
  } else {
    text += `📥 Пока нет доступных предложений.\n`;
  }

  await ctx.reply(text + `\nИспользуй Mini App для создания/покупки трейдов.`);
}