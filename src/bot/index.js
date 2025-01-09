/* eslint-disable no-undef */
import { Bot, session, InlineKeyboard } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { config } from "dotenv";
import { registerConversation } from "../conversations/index.js";
import { startCommand } from "../commands/index.js";

config()

export const bot = new Bot(process.env.TOKEN)

bot.use(session({
  initial: () => ({
    email: null,
    lang: null,
    role: null,
    conversation: {}
  })
}))

bot.use(conversations())
bot.use(createConversation(registerConversation))

bot.command('start', async (ctx) => {
  startCommand(ctx)
})

bot.on('callback_query:data', async (ctx) => {
  try {
    const callBackData = ctx.update.callback_query.data;
    const [command] = callBackData.split('=');

    switch (command) {
      case 'register':
        await ctx.conversation.enter('registerConversation');
        break;

      case 'login':
        await ctx.conversation.enter('loginConversation');
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

bot.hears(`O'zbek 🇺🇿`, (ctx) => {
  ctx.session.lang = 'uz';
  const message = `Botdan to'liq foydalanish uchun ro'yxatdan o'ting yoki tizimga kiring.`;
  const authKeys = new InlineKeyboard()
    .text(`Ro'yxatdan o'tish`, 'register')
    .row()
    .text('Tizimga kirish', 'login');
  return ctx.reply(message, {
    reply_markup: authKeys,
  });
});

bot.hears(`English 🇺🇸`, (ctx) => {
  ctx.session.lang = 'en';
  const message = `To fully use the bot, please sign up or log in.`;
  const authKeys = new InlineKeyboard()
    .text(`Sign Up`, 'register')
    .row()
    .text('Sign In', 'login');
  return ctx.reply(message, {
    reply_markup: authKeys,
  });
});

bot.hears(`Русский 🇷🇺`, (ctx) => {
  ctx.session.lang = 'ru';
  const message = `Для полного использования бота зарегистрируйтесь или войдите в систему.`;
  const authKeys = new InlineKeyboard()
    .text(`Регистрация`, 'register')
    .row()
    .text('Войти', 'login');
  return ctx.reply(message, {
    reply_markup: authKeys,
  });
});