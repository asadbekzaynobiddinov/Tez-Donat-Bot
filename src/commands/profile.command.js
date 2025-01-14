/* eslint-disable no-undef */
import { config } from 'dotenv';
import { User } from '../models/index.js';
import { startCommand } from './start.command.js'

config()

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
          `Hisob 💰: ${parseInt(user.balance)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`;
        ctx.session.lastMessage = await ctx.reply(message);
        break;
      case 'en':
        message =
          `Your profile information\n` +
          `Email 👤: ${user.email}\n` +
          `Balance 💰: ${parseInt(user.balance)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`;
        ctx.session.lastMessage = await ctx.reply(message);
        break;
      case 'ru':
        message =
          `Информация вашего профиля\n` +
          `Электронная почта 👤: ${user.email}\n` +
          `Баланс 💰: ${parseInt(user.balance)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} cум`;
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
