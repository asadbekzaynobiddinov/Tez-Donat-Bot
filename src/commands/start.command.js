import { Keyboard, InlineKeyboard } from 'grammy';
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
      mainMenuKeys = new InlineKeyboard()
        .text(`🛒 Do'kon`, 'shop')
        .text('👤 Kabinet', 'profile').row()
        .text('🌐 Buyurtmalar tarixi', 'order_history')
        .text(`💰 Xisob to'ldirish`, 'payment').row()
        .text(`📕 Qo'llanma`, 'manual')
        .text('☎️ Yordam uchun', 'for_help').row()
        .text(`📝 To'lov tarixi`, 'payment_history').row()
        .text(`🌍 Tilni o'zgartirish`, 'change_lang');
      ctx.reply(`Kereakli bo'limni tanlang`, {
        reply_markup: mainMenuKeys
      });  
      break;
  
    case 'en':
      mainMenuKeys = new InlineKeyboard()
        .text('🛒 Shop', 'shop')
        .text('👤 Profile', 'profile').row()
        .text('🌐 Order History', 'order_history')
        .text('💰 Recharge Account', 'payment').row()
        .text('📕 Manual', 'manual')
        .text('☎️ Help', 'for_help').row()
        .text('📝 Payment History', 'payment_history').row()
        .text('🌍 Change Language', 'change_lang');

      ctx.reply(`Select the desired section`, {
        reply_markup: mainMenuKeys
      });
      break;

    case 'ru':
      mainMenuKeys = new InlineKeyboard()
        .text('🛒 Магазин', 'shop')
        .text('👤 Профиль', 'profile').row()
        .text('🌐 История заказов', 'order_history')
        .text('💰 Пополнение счета', 'payment').row()
        .text('📕 Руководство', 'manual')
        .text('☎️ Помощь', 'for_help').row()
        .text('📝 История платежей', 'payment_history').row()
        .text('🌍 Сменить язык', 'change_lang');
      
      ctx.reply(`Выберите нужный раздел`, {
        reply_markup: mainMenuKeys
      });
      break;
    
    default:
      break;
  }
};
