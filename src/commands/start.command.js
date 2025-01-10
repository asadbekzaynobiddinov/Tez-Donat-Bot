import { Keyboard } from 'grammy';
import { User } from '../schemas/index.js';

export const startCommand = async (ctx) => {
  let currentUser;

  try {
    currentUser = await User.findOne({ where: { telegram_id: ctx.from.id } });
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }

  if (!ctx.session.lang) {
    const message =
      'Assalomu alaykum! \nTez Donat Servicega xush kelibsiz.\n' +
      `Kerakli tilni tanlang: 🇺🇿\n\n` +
      'Hello! \nWelcome to Tez Donat Service.\n' +
      'Choose your language: 🇺🇸\n\n' +
      'Здравствуйте! \nДобро пожаловать в Tez Donat Service.\n' +
      'Выберите язык: 🇷🇺';

    const langKeys = new Keyboard()
      .text(`O'zbek 🇺🇿`)
      .row()
      .text(`English 🇺🇸`)
      .row()
      .text(`Русский 🇷🇺`)
      .resized()
      .oneTime();

    return ctx.reply(message, {
      reply_markup: langKeys,
    });
  }

  if (!currentUser) {
    switch (ctx.session.lang) {
      case 'uz':
        return ctx.reply(`Botdan to'liq foydalanish uchun ro'yxatdan o'ting.`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: `Ro'yxatdan o'tish`, callback_data: 'register' }],
            ],
          },
        });

      case 'en':
        return ctx.reply(`To fully use the bot, please register.`, {
          reply_markup: {
            inline_keyboard: [[{ text: `Sign Up`, callback_data: 'register' }]],
          },
        });

      case 'ru':
        return ctx.reply(
          `Чтобы полностью использовать бота, зарегистрируйтесь.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: `Регистрация`, callback_data: 'register' }],
              ],
            },
          }
        );

      default:
        break;
    }
  }

  let mainMenuKeys;

  switch (ctx.session.lang) {
    case 'uz':
      mainMenuKeys = new Keyboard()
        .text(`🛒 Do'kon`)
        .text('👤 Kabinet')
        .row()
        .text('🌐 Buyurtmalar tarixi')
        .text(`💰 Xisob to'ldirish`)
        .row()
        .text(`📕 Qo'llanma`)
        .text('☎️ Yordam uchun')
        .row()
        .text(`📝 To'lov tarixi`)
        .text(`🌍 Tilni o'zgartirish`)
        .resized();
      ctx.reply(`☟ Kereakli bo'limni tanlang:`, {
        reply_markup: mainMenuKeys,
      });
      break;

    case 'en':
      mainMenuKeys = new Keyboard()
        .text('🛒 Shop')
        .text('👤 Profile')
        .row()
        .text('🌐 Order History')
        .text('💰 Recharge Account')
        .row()
        .text('📕 Manual')
        .text('☎️ Help')
        .row()
        .text('📝 Payment History')
        .text('🌍 Change Language')
        .resized();

      ctx.reply(`☟ Select the desired section:`, {
        reply_markup: mainMenuKeys,
      });
      break;

    case 'ru':
      mainMenuKeys = new Keyboard()
        .text('🛒 Магазин')
        .text('👤 Профиль')
        .row()
        .text('🌐 История заказов')
        .text('💰 Пополнение счета')
        .row()
        .text('📕 Руководство')
        .text('☎️ Помощь')
        .row()
        .text('📝 История платежей')
        .text('🌍 Сменить язык')
        .resized();

      ctx.reply(`☟ Выберите нужный раздел:`, {
        reply_markup: mainMenuKeys,
      });
      break;

    default:
      break;
  }
  return;
};
