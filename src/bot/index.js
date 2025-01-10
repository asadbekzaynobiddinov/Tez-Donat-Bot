/* eslint-disable no-undef */
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { config } from 'dotenv';
import { registerConversation } from '../conversations/index.js';
import {
  startCommand,
  shopCommand,
  changeLang,
  setLang,
  profileCommmand
} from '../commands/index.js';

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

    switch (command) {
      case 'register':
        await ctx.conversation.enter('registerConversation');
        break;
      case 'uz':
        setLang(ctx, 'uz');
        break;
      case 'en':
        setLang(ctx, 'en');
        break;
      case 'ru':
        setLang(ctx, 'ru');
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

bot.hears(`🛒 Do'kon`, (ctx) => {
  shopCommand(ctx);
});

bot.hears(`🛒 Shop`, (ctx) => {
  shopCommand(ctx);
});

bot.hears(`🛒 Магазин`, (ctx) => {
  shopCommand(ctx);
});

bot.hears(`🌍 Tilni o'zgartirish`, (ctx) => {
  changeLang(ctx);
});

bot.hears(`🌍 Change Language`, (ctx) => {
  changeLang(ctx);
});

bot.hears(`🌍 Сменить язык`, (ctx) => {
  changeLang(ctx);
});

bot.hears('👤 Kabinet', (ctx) => {
  profileCommmand(ctx);
});

bot.hears(`👤 Profile`, (ctx) => {
  profileCommmand(ctx);
});

bot.hears(`👤 Профиль`, (ctx) => {
  profileCommmand(ctx);
});

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });

// bot.hears(`🌍 Сменить язык`, (ctx) => {
//   changeLang(ctx);
// });


