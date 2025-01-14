/* eslint-disable no-undef */
import { User } from '../models/index.js';
import { startCommand } from './start.command.js';

export const profileCommmand = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
    if (!user) {
      startCommand(ctx);
    }
    let message = '';
    switch (user.language) {
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
        break;
    }
  } catch (error) {
    console.log(error);
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};
