import { Keyboard } from "grammy";
import { User } from "../schemas/index.js";
import { startCommand } from "./start.command.js";

export const profileCommmand = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } })
    if (!user) {
      startCommand(ctx)
    }
    let message = ''
    let langKeys
    switch (ctx.session.lang) {
      case 'uz':
        message =
          `Email 👤: ${user.email}\n` +
          `Hisob 💰: ${user.balance} so'm`;
        ctx.reply(message);
        break;
      case 'en':
        message =
          `Email 👤: ${user.email}\n` +
          `Balance 💰: ${user.balance} so'm`
        ctx.reply(message)
        break
      case 'ru':
        message =
          `Электронная почта 👤: ${user.email}\n` +
          `Баланс 💰: ${user.balance} cум`
        ctx.reply(message)
        break
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


        return ctx.reply(message, {
          reply_markup: langKeys,
        });
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message)
  }
}