import { PrismaClient } from '@prisma/client';
import type { CallbackQuery } from 'grammy';

export async function handleCallbackQuery(ctx: CallbackQuery, prisma: PrismaClient) {
  const data = ctx.callbackQuery?.data;
  if (!data) return;

  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });

  if (!user) {
    await ctx.answerCallbackQuery('❌ Сначала напиши /start');
    return;
  }

  // Route callback data
  if (data === 'menu') {
    await ctx.editMessageText('📋 Главное меню КАПСУЛЫ');
    return;
  }

  if (data === 'open_capsule') {
    await ctx.answerCallbackQuery('Выбери капсулу в магазине!');
    // Could redirect to shop
    return;
  }

  if (data === 'my_pets') {
    await ctx.answerCallbackQuery('Загружаю питомцев...');
    // Could show pet list
    return;
  }

  if (data.startsWith('capsule_')) {
    await handleCapsulePurchase(ctx, prisma, user, data);
    return;
  }

  if (data.startsWith('feed_') || data.startsWith('play_') || data.startsWith('rest_')) {
    await handlePetAction(ctx, prisma, user, data);
    return;
  }

  await ctx.answerCallbackQuery('🔥 Функционал в разработке!');
}

async function handleCapsulePurchase(
  ctx: CallbackQuery,
  prisma: PrismaClient,
  user: { id: string; starsBalance: number; firstName: string },
  data: string,
) {
  const prices: Record<string, number> = {
    capsule_small: 10,
    capsule_medium: 50,
    capsule_big: 100,
    capsule_golden: 500,
  };

  const capsuleKey = data as keyof typeof prices;
  const price = prices[capsuleKey];

  if (!price) {
    await ctx.answerCallbackQuery('❌ Неизвестная капсула');
    return;
  }

  if (user.starsBalance < price) {
    await ctx.answerCallbackQuery(`❌ Недостаточно ⭐ (нужно ${price})`);
    return;
  }

  // Deduct stars
  await prisma.user.update({
    where: { id: user.id },
    data: { starsBalance: { decrement: price } },
  });

  // Generate pet based on capsule type
  const pet = await generatePet(prisma, capsuleKey);

  await ctx.answerCallbackQuery(
    `🎉 ${user.firstName} открывает капсулу...`,
  );

  await ctx.editMessageText(
    `✨ Тебе выпал(а):\n\n` +
    `${getRarityEmoji(pet.rarity)} ${pet.name}\n` +
    `Тип: ${pet.type} | Редкость: ${pet.rarity}\n` +
    `⭐ Уровень 1\n\n` +
    `Поздравляем! 🎊`,
  );
}

async function generatePet(prisma: PrismaClient, capsuleType: string): Promise<{
  name: string;
  type: string;
  rarity: string;
}> {
  // Rarity chances based on capsule type
  const rarityChances: Record<string, { rarity: string; chance: number }[]> = {
    capsule_small: [
      { rarity: 'COMMON', chance: 0.70 },
      { rarity: 'UNCOMMON', chance: 0.25 },
      { rarity: 'RARE', chance: 0.05 },
    ],
    capsule_medium: [
      { rarity: 'COMMON', chance: 0.60 },
      { rarity: 'UNCOMMON', chance: 0.25 },
      { rarity: 'RARE', chance: 0.12 },
      { rarity: 'EPIC', chance: 0.03 },
    ],
    capsule_big: [
      { rarity: 'COMMON', chance: 0.50 },
      { rarity: 'UNCOMMON', chance: 0.30 },
      { rarity: 'RARE', chance: 0.15 },
      { rarity: 'EPIC', chance: 0.04 },
      { rarity: 'LEGENDARY', chance: 0.01 },
    ],
    capsule_golden: [
      { rarity: 'RARE', chance: 0.50 },
      { rarity: 'EPIC', chance: 0.35 },
      { rarity: 'LEGENDARY', chance: 0.14 },
      { rarity: 'MYTHIC', chance: 0.01 },
    ],
  };

  const chances = rarityChances[capsuleType] || rarityChances.capsule_small;
  const roll = Math.random();
  let cumulative = 0;
  let selectedRarity = 'COMMON';

  for (const { rarity, chance } of chances) {
    cumulative += chance;
    if (roll <= cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  const petTypes = ['STIRLING', 'FLAMIKIN', 'DROPLET', 'GROWLY', 'SPARKLE', 'LUNARIK'];
  const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
  
  const petNames: Record<string, string[]> = {
    STIRLING: ['Стелла', 'Звездунчик', 'Люмин', 'Астра'],
    FLAMIKIN: ['Огненёк', 'Пламяк', 'Искорка', 'Эмбер'],
    DROPLET: ['Капелька', 'Волна', 'Росинка', 'Аква'],
    GROWLY: ['Лесовичок', 'Моховичок', 'Дубрав', 'Грибочек'],
    SPARKLE: ['Искорка', 'Электроник', 'Молния', 'Заряд'],
    LUNARIK: ['Лунарик', 'Селена', 'Полумесяц', 'Зенит'],
  };

  const names = petNames[petType as keyof typeof petNames];
  const petName = names[Math.floor(Math.random() * names.length)];

  // Create pet in DB (we need user ID, using placeholder)
  // In real implementation, this would use the actual user
  
  return { name: petName, type: petType, rarity: selectedRarity };
}

async function handlePetAction(
  ctx: CallbackQuery,
  prisma: PrismaClient,
  user: { id: string },
  data: string,
) {
  // Parse action and pet ID
  const [action, petId] = data.split('_');
  
  await ctx.answerCallbackQuery(`${getActionEmoji(action!)} Выполнено!`);
}

function getActionEmoji(action: string): string {
  const emojis: Record<string, string> = {
    feed: '🍖',
    play: '🎾',
    rest: '💤',
    wash: '🛁',
    evolve: '🔄',
  };
  return emojis[action] || '✅';
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