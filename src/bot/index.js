/* eslint-disable no-undef */
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { config } from 'dotenv';
import { registerConversation } from '../conversations/index.js';
import { startCommand } from '../commands/index.js';

config();

export const bot = new Bot(process.env.TOKEN);

bot.use(
  session({
    initial: () => ({
      conversation: {},
    }),
  })
);

bot.use(conversations());
bot.use(createConversation(registerConversation));

bot.command('start', async (ctx) => {
  startCommand(ctx);
});

bot.on('callback_query:data', async (ctx) => {
  try {
    const callBackData = ctx.update.callback_query.data;
    const [command] = callBackData.split('=');

    console.log(command)

    switch (command) {
      case 'register':
        await ctx.conversation.enter('registerConversation');
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
  startCommand(ctx);
});

bot.hears(`English 🇺🇸`, (ctx) => {
  ctx.session.lang = 'en';
  startCommand(ctx);
});

bot.hears(`Русский 🇷🇺`, (ctx) => {
  ctx.session.lang = 'ru';
  startCommand(ctx);
});
