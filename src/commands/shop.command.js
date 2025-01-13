import { InlineKeyboard, Keyboard } from 'grammy';
import {
  freeFire,
  mobileLegendsTurk,
  mobileLegendsSng,
  pubg,
} from '../inline-keys/index.js';

export const shopCommand = async (ctx) => {
  const message = {
    uz: `☟ Kereakli bo'limni tanlang:`,
    en: `☟ Select the desired section:`,
    ru: `☟ Выберите нужный раздел:`,
  };

  const keys = new InlineKeyboard()
    .text('PUBG MOBILE', 'pubg')
    .text('FREE FIRE', 'ff')
    .row()
    .text('MOBILE LEGENDS SNG', 'mlbb_sng')
    .row()
    .text('MOBILE LEGENDS TURK', 'mlbb_turk');

  switch (ctx.session.lang) {
    case 'uz':
      ctx.session.lastMessage = await ctx.reply(message.uz, {
        reply_markup: keys,
      });
      break;
    case 'en':
      ctx.session.lastMessage = await ctx.reply(message.en, {
        reply_markup: keys,
      });
      break;
    case 'ru':
      ctx.session.lastMessage = await ctx.reply(message.ru, {
        reply_markup: keys,
      });
      break;
    default: {
      const langMessage =
        `Kerakli tilni tanlang: 🇺🇿\n` +
        'Choose your language: 🇺🇸\n' +
        'Выберите язык: 🇷🇺';

      const langKeys = new Keyboard()
        .text(`O'zbek 🇺🇿`)
        .row()
        .text(`English 🇺🇸`)
        .row()
        .text(`Русский 🇷🇺`)
        .resized()
        .oneTime();

      await ctx.reply(langMessage, {
        reply_markup: langKeys,
      });
      return;
    }
  }
};

export const shopDepartments = async (ctx, command) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id ==
        ctx.update.callback_query.message.message_id
    ) {
      const messages = {
        uz: `☟ Kereakli bo'limni tanlang:`,
        en: `☟ Select the desired section:`,
        ru: '☟ Выберите нужный раздел:',
      };

      switch (command) {
        case 'pubg':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[ctx.session.lang],
            {
              reply_markup: pubg,
            }
          );
          break;
        case 'ff':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[ctx.session.lang],
            {
              reply_markup: freeFire,
            }
          );
          break;
        case 'mlbb_sng':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[ctx.session.lang],
            {
              reply_markup: mobileLegendsSng,
            }
          );
          break;
        case 'mlbb_turk':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[ctx.session.lang],
            {
              reply_markup: mobileLegendsTurk,
            }
          );
          break;
        default:
          break;
      }
    } else {
      ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id
      );
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};
