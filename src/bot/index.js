/* eslint-disable no-undef */
import { Bot, session, Keyboard } from 'grammy';
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
  acceptPayment,
  rejectPaynment,
  backKey,
  ordersHistory,
  prevCommand,
  nextCommand,
  orderButtons,
  removeOrderButtons,
} from '../commands/index.js';
import { User } from '../models/index.js';
import { helpCommand, manualCommand } from '../commands/other.commands.js';

config();



export const bot = new Bot(process.env.TOKEN);

bot.use(
  session({
    initial: () => ({
      conversation: {},
      page: 1,
      limit: 10,
    }),
  })
);

// try {
//   bot.api.setMyCommands([
//     { command: 'start', description: 'start' },
//     { command: 'shop', description: '🛒 Shop' },
//     { command: 'profile', description: '👤 Profile' },
//     { command: 'payment', description: '💰 Recharge Account' },
//     { command: 'history', description: '🌐 Order History' },
//     { command: 'manual', description: '📕 Manual' },
//     { command: 'help', description: '☎️ Help' },
//   ]);
// } catch (error) {
//   bot.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
// }

bot.use(conversations());
bot.use(createConversation(registerConversation));
bot.use(createConversation(orderConversation));
bot.use(createConversation(paymentConversation));

bot.command('start', async (ctx) => {
  startCommand(ctx);
});

bot.command('shop', (ctx) => {
  shopCommand(ctx)
})

bot.command('profile', (ctx) => {
  profileCommmand(ctx)
})

bot.command('payment', (ctx) => {
  startPayment(ctx);
})

bot.command('history', (ctx) => {
  ordersHistory(ctx);
})

bot.command('manual', (ctx) => {
  manualCommand(ctx);
})

bot.command('help', (ctx) => {
  helpCommand(ctx);
})

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
      case 'accept':
        acceptPayment(ctx);
        break;
      case 'reject':
        rejectPaynment(ctx);
        break;
      case 'back':
        backKey(ctx);
        break;
      case 'prev':
        prevCommand(ctx);
        break;
      case 'next':
        nextCommand(ctx);
        break;
      case 'order':
        orderButtons(ctx);
        break;
      case 'remove':
        removeOrderButtons(ctx);
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

bot.hears(`🌐 Buyurtmalar tarixi`, (ctx) => {
  ordersHistory(ctx);
});

bot.hears(`🌐 Order History`, (ctx) => {
  ordersHistory(ctx);
});

bot.hears(`🌐 История заказов`, (ctx) => {
  ordersHistory(ctx);
});

bot.hears('⬅️ Orqaga', async (ctx) => {
  const mainMenuKeys = new Keyboard()
    .text(`🛒 Do'kon`)
    .text('👤 Kabinet')
    .row()
    .text('🌐 Buyurtmalar tarixi')
    .text(`💰 Xisob to'ldirish`)
    .row()
    .text(`📕 Qo'llanma`)
    .text('☎️ Yordam uchun')
    .row()
    .resized();
  ctx.session.lastMessage = await ctx.reply(`☟ Kereakli bo'limni tanlang:`, {
    reply_markup: mainMenuKeys,
  });
});

bot.hears('⬅️ Back', async (ctx) => {
  const mainMenuKeys = new Keyboard()
    .text('🛒 Shop')
    .text('👤 Profile')
    .row()
    .text('🌐 Order History')
    .text('💰 Recharge Account')
    .row()
    .text('📕 Manual')
    .text('☎️ Help')
    .resized();

  ctx.session.lastMessage = await ctx.reply(`☟ Select the desired section:`, {
    reply_markup: mainMenuKeys,
  });
});

bot.hears('⬅️ Назад', async (ctx) => {
  const mainMenuKeys = new Keyboard()
    .text('🛒 Магазин')
    .text('👤 Профиль')
    .row()
    .text('🌐 История заказов')
    .text('💰 Пополнение счета')
    .row()
    .text('📕 Руководство')
    .text('☎️ Помощь')
    .row()
    .resized();

  ctx.session.lastMessage = await ctx.reply(`☟ Выберите нужный раздел:`, {
    reply_markup: mainMenuKeys,
  });
});

bot.hears(`📕 Qo'llanma`, (ctx) => {
  manualCommand(ctx);
});

bot.hears('📕 Manual', (ctx) => {
  manualCommand(ctx);
});

bot.hears('📕 Руководство', (ctx) => {
  manualCommand(ctx);
});

bot.hears('☎️ Yordam uchun', (ctx) => {
  helpCommand(ctx);
});

bot.hears('☎️ Help', (ctx) => {
  helpCommand(ctx);
});

bot.hears('☎️ Помощь', (ctx) => {
  helpCommand(ctx);
});
