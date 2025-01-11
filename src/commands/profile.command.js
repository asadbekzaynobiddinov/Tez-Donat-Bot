import { Keyboard } from 'grammy';
import { User } from '../models/index.js';
import { startCommand } from './start.command.js';

export const profileCommmand = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
    if (!user) {
      startCommand(ctx);
    }
    let message = '';
    let langKeys;
    switch (ctx.session.lang) {
      case 'uz':
        message =
          `Sizning profilingiz ma'lumotlari\n` +
          `Email 👤: ${user.email}\n` +
          `Hisob 💰: ${user.balance} so'm`;
        ctx.session.lastMessage = await ctx.reply(message);
        break;
      case 'en':
        message =
          `Your profile information\n` +
          `Email 👤: ${user.email}\n` +
          `Balance 💰: ${user.balance} so'm`;
        ctx.session.lastMessage = await ctx.reply(message);
        break;
      case 'ru':
        message =
          `Информация вашего профиля\n` +
          `Электронная почта 👤: ${user.email}\n` +
          `Баланс 💰: ${user.balance} cум`;
        ctx.session.lastMessage = await ctx.reply(message);
        break;
      default:
        message =
          `Kerakli tilni tanlang: 🇺🇿\n` +
          'Choose your language: 🇺🇸\n' +
          'Выберите язык: 🇷🇺';

        langKeys = new Keyboard()
          .text(`O'zbek 🇺🇿`)
          .row()
          .text(`English 🇺🇸`)
          .row()
          .text(`Русский 🇷🇺`)
          .resized()
          .oneTime();

        ctx.session.lastMessage = await ctx.reply(message, {
          reply_markup: langKeys,
        });
        return
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};
