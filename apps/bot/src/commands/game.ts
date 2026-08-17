import { Context, CommandContext } from 'grammy';

export async function gameCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `🎮 МИНИ-ИГРА: Поймай звезду!\n\n` +
    `Лови падающие звёзды в течение 30 секунд!\n\n` +
    `🏆 Награды:\n` +
    `• 1-50 очков → 1 еда\n` +
    `• 51-100 очков → 2 еды\n` +
    `• 100+ очков → 3 еды\n\n` +
    `🧲 Бусты (покупаются за ⭐):\n` +
    `• Магнит (5 ⭐) → x2 очки\n` +
    `• Ускорение (10 ⭐) → +15 секунд\n\n` +
    `Открой Mini App чтобы играть!`,
  );
}