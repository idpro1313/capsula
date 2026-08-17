import { InlineKeyboard } from 'grammy';

export const mainMenuKeyboard = new InlineKeyboard()
  .text('🎁 Открыть капсулу', 'open_capsule')
  .text('🐾 Мои питомцы', 'my_pets').row()
  .text('🛒 Магазин', 'shop')
  .text('🎮 Мини-игра', 'mini_game').row()
  .text('💱 Торговля', 'trade')
  .text('👤 Профиль', 'profile').row()
  .text('❓ Помощь', 'help');

export const backToMenuKeyboard = new InlineKeyboard()
  .text('📋 Меню', 'menu');

export const capsuleSizeKeyboard = new InlineKeyboard()
  .text('🎁 Малая (10 ⭐)', 'capsule_small')
  .text('🎁 Средняя (50 ⭐)', 'capsule_medium').row()
  .text('🎁 Большая (100 ⭐)', 'capsule_big')
  .text('🎁 Золотая (500 ⭐)', 'capsule_golden').row()
  .text('◀️ Назад', 'menu');

export const petActionsKeyboard = (petId: string) => new InlineKeyboard()
  .text('🍖 Покормить', `feed_${petId}`)
  .text('🎾 Поиграть', `play_${petId}`).row()
  .text('💤 Отдохнуть', `rest_${petId}`)
  .text('🛁 Помыть', `wash_${petId}`).row()
  .text('🔄 Эволюция', `evolve_${petId}`)
  .text('💱 Продать', `sell_${petId}`).row()
  .text('◀️ Назад', 'my_pets');

export const confirmKeyboard = (action: string, id: string) => new InlineKeyboard()
  .text('✅ Да', `confirm_${action}_${id}`)
  .text('❌ Нет', `cancel_${action}_${id}`);