/* eslint-disable no-undef */
import { User } from '../models/index.js';
import { config } from 'dotenv';

config();

export const helpCommand = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
    const message = {
      uz:
        `To'lovlar yuzasidan:\nAdmin: <a>@Rastar_uz</a>\n\n` +
        `Texnik muammolar yuzasidan:\nAdmin: <a>@zaynobiddinovasadbek</a>`,
      en:
        `For payments:\nAdmin: <a>@Rastar_uz</a>\n\n` +
        `For technical issues:\nAdmin: <a>@zaynobiddinovasadbek</a>`,
      ru:
        `По вопросам оплаты:\nAdmin: <a>@Rastar_uz</a>\n\n` +
        `По техническим вопросам:\nAdmin: <a>@zaynobiddinovasadbek</a>`,
    };
    return await ctx.reply(message[user.language], { parse_mode: 'HTML' });
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const manualCommand = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
    const message = {
      uz: `Tez orada bot uchun qo'llanma yoziladi`,
      en: `A guide for the bot will be written soon`,
      ru: `Скоро будет написано руководство для бота`,
    };
    return await ctx.reply(message[user.language]);
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};
