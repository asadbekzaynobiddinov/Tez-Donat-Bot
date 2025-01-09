import { Keyboard } from 'grammy';

export const startCommand = (ctx) => {
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

  console.log(ctx.session);

  if (!ctx.session.email) {
    switch (ctx.session.lang) {
      case 'uz':
        return ctx.reply(
          `Botdan to'liq foydalanish uchun ro'yxatdan o'ting yoki tizimga kiring.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: `Ro'yxatdan o'tish`, callback_data: 'register' }],
                [{ text: 'Tizimga kirish', callback_data: 'login' }],
              ],
            },
          },
        );

      case 'en':
        return ctx.reply(`To fully use the bot, please register or log in.`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: `Sign Up`, callback_data: 'register' }],
              [{ text: 'Sign in', callback_data: 'login' }],
            ],
          },
        });

      case 'ru':
        return ctx.reply(
          `Чтобы полностью использовать бота, зарегистрируйтесь или войдите в систему.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: `Регистрация`, callback_data: 'register' }],
                [{ text: 'Войти', callback_data: 'login' }],
              ],
            },
          },
        );

      default:
        break;
    }
  }

  switch (ctx.session.lang) {
    case 'uz':
      ctx.reply(`Kereakli bo'limni tanlang`);
      break;
    case 'en':
      ctx.reply(`Select the desired section`);
      break;
    case 'ru':
      ctx.reply(`Выберите нужный раздел`);
      break;
    default:
      break;
  }
};
