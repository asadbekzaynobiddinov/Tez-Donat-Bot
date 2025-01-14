/* eslint-disable no-undef */
import { Bot, session } from 'grammy';
import { conversations, createConversation } from '@grammyjs/conversations';
import { config } from 'dotenv';
import {
  registerConversation,
  orderConversation,
  paymentConversation,
} from '../conversations/index.js';
import {
  startCommand,
  shopCommand,
  changeLang,
  setLang,
  profileCommmand,
  shopDepartments,
  buyOrder,
  cancelOrder,
  paidCommand,
  didNotPayCommand,
  startPayment,
  paymentDepartments,
} from '../commands/index.js';
import { User } from '../models/index.js';

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
bot.use(createConversation(orderConversation));
bot.use(createConversation(paymentConversation));

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
      case 'pubg':
      case 'ff':
      case 'mlbb_sng':
      case 'mlbb_turk':
      case 'clash':
        shopDepartments(ctx, command);
        break;
      case 'shop_key':
        await ctx.conversation.enter('orderConversation');
        break;
      case 'buy':
        buyOrder(ctx);
        break;
      case 'cancel':
        cancelOrder(ctx);
        break;
      case 'paid':
        paidCommand(ctx);
        break;
      case 'did_not_pay':
        didNotPayCommand(ctx);
        break;
      case 'ru-uz':
      case 'uz-uz':
        paymentDepartments(ctx);
        break;
      default:
        break;
    }
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
});

bot.hears(`O'zbek 🇺🇿`, async (ctx) => {
  ctx.session.lang = 'uz';
  await User.update(
    { language: 'uz' },
    { where: { telegram_id: ctx.from.id } }
  );
  startCommand(ctx);
});

bot.hears(`English 🇺🇸`, async (ctx) => {
  ctx.session.lang = 'en';
  await User.update(
    { language: 'en' },
    { where: { telegram_id: ctx.from.id } }
  );
  startCommand(ctx);
});

bot.hears(`Русский 🇷🇺`, async (ctx) => {
  ctx.session.lang = 'ru';
  await User.update(
    { language: 'ru' },
    { where: { telegram_id: ctx.from.id } }
  );
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

bot.hears(`💰 Xisob to'ldirish`, (ctx) => {
  startPayment(ctx);
});

bot.hears(`💰 Recharge Account`, (ctx) => {
  startPayment(ctx);
});

bot.hears(`💰 Пополнение счета`, (ctx) => {
  startPayment(ctx);
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
