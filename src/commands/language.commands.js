/* eslint-disable no-undef */
import { InlineKeyboard, Keyboard } from 'grammy';
import { config } from 'dotenv';
import { User } from '../models/index.js';

config();

export const changeLang = async (ctx) => {
  const lang = ctx.session.lang ? ctx.session.lang : ctx.from.language_code;

  const langKeys = new InlineKeyboard()
    .text(`O'zbek 🇺🇿`, 'uz')
    .row()
    .text(`English 🇺🇸`, 'en')
    .row()
    .text(`Русский 🇷🇺`, 'ru');

  try {
    const langMessages = {
      uz: '☟ Kerakli tilni tanlang:',
      en: '☟ Select your preferred language:',
      ru: '☟ Выберите предпочитаемый язык:',
    };

    ctx.session.lastMessage = await ctx.reply(langMessages[lang], {
      reply_markup: langKeys,
    });
    return;
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const setLang = async (ctx, lang) => {
  let mainMenuKeys;

  const messages = {
    uz: `☟ Kereakli bo'limni tanlang:`,
    en: `☟ Select the desired section:`,
    ru: '☟ Выберите нужный раздел:',
  };

  ctx.session.lang = lang;

  await User.update(
    { language: lang },
    { where: { telegram_id: ctx.from.id } }
  );

  switch (lang) {
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
        .resized();
      try {
        await ctx.api.deleteMessage(
          ctx.from.id,
          ctx.update.callback_query.message.message_id
        );
        ctx.session.lastMessage = await ctx.reply(messages[lang], {
          reply_markup: mainMenuKeys,
        });
      } catch (error) {
        ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
      }
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
        .resized();
      try {
        await ctx.api.deleteMessage(
          ctx.from.id,
          ctx.update.callback_query.message.message_id
        );
        ctx.session.lastMessage = await ctx.reply(messages[lang], {
          reply_markup: mainMenuKeys,
        });
      } catch (error) {
        ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
      }
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
        .resized();
      try {
        await ctx.api.deleteMessage(
          ctx.from.id,
          ctx.update.callback_query.message.message_id
        );
        ctx.session.lastMessage = await ctx.reply(messages[lang], {
          reply_markup: mainMenuKeys,
        });
      } catch (error) {
        ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
      }
      break;
    default:
      break;
  }
};
