import { Context, CommandContext } from 'grammy';
import { mainMenuKeyboard } from '../keyboards/menu.js';

export async function menuCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `📋 Главное меню КАПСУЛЫ\n\n` +
    `Выбери действие:`,
    { reply_markup: mainMenuKeyboard },
  );
}