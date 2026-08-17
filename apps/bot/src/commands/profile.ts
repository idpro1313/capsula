import { PrismaClient } from '@prisma/client';
import { Context, CommandContext } from 'grammy';

export async function profileCommand(ctx: CommandContext<Context>, prisma: PrismaClient) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    include: {
      pets: {
        orderBy: { level: 'desc' },
        take: 5,
      },
      dailyReward: true,
    },
  });

  if (!user) {
    await ctx.reply('❌ Профиль не найден. Напиши /start');
    return;
  }

  const petCount = await prisma.pet.count({ where: { ownerId: user.id } });
  const bestPet = user.pets[0];

  let streakText = '';
  if (user.dailyReward) {
    const lastClaim = new Date(user.dailyReward.lastClaim);
    const now = new Date();
    const daysSinceClaim = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceClaim <= 1) {
      streakText = `🔥 Streak: ${user.dailyReward.streak} дней`;
    } else {
      streakText = '💤 Streak: 0 дней (заходи каждый день!)';
    }
  }

  const profileText =
    `👤 ${user.firstName}${user.username ? ` (@${user.username})` : ''}\n\n` +
    `⭐ Баланс: ${user.starsBalance} Stars\n` +
    `🐾 Питомцев: ${petCount}\n` +
    (streakText ? `${streakText}\n` : '') +
    (bestPet ? `\n🏆 Лучший питомец:\n` +
      `  ${getRarityEmoji(bestPet.rarity)} ${bestPet.name} (${bestPet.type})\n` +
      `  ⭐ Уровень ${bestPet.level} | ${bestPet.experience} XP` : '');

  await ctx.reply(profileText);
}

function getRarityEmoji(rarity: string): string {
  const emojis: Record<string, string> = {
    COMMON: '⚪',
    UNCOMMON: '🟢',
    RARE: '🔵',
    EPIC: '🟣',
    LEGENDARY: '🟡',
    MYTHIC: '🌈',
  };
  return emojis[rarity] || '⚪';
}