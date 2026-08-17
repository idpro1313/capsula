import { PrismaClient } from '@prisma/client';
import type { CommandContext } from 'grammy';

export async function inventoryCommand(ctx: CommandContext, prisma: PrismaClient) {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });

  if (!user) {
    await ctx.reply('❌ Сначала напиши /start');
    return;
  }

  const pets = await prisma.pet.findMany({
    where: { ownerId: user.id },
    orderBy: [{ level: 'desc' }, { createdAt: 'desc' }],
  });

  if (pets.length === 0) {
    await ctx.reply(
      '📦 У тебя пока нет питомцев!\n\n' +
      'Открой капсулу, чтобы получить первого ⭐',
    );
    return;
  }

  const petList = pets.slice(0, 10).map((pet, i) => {
    const emoji = getRarityEmoji(pet.rarity);
    const stats = `🍖${pet.hunger} 😊${pet.happiness} ⚡${pet.energy}`;
    return `${i + 1}. ${emoji} ${pet.name} (${pet.type})\n   ⭐${pet.level} | ${stats}`;
  }).join('\n\n');

  await ctx.reply(
    `🐾 Твои питомцы (${pets.length}):\n\n${petList}\n\n` +
    (pets.length > 10 ? `... и ещё ${pets.length - 10} питомцев` : ''),
  );
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