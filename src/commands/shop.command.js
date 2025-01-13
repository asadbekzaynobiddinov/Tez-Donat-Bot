import { InlineKeyboard, Keyboard } from 'grammy';
import {
  freeFire,
  mobileLegendsTurk,
  mobileLegendsSng,
  pubg,
} from '../inline-keys/index.js';
import { User, Order } from '../models/index.js';

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

export const buyOrder = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const order = await Order.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: order.user_id } });

    user.balance -= order.price;
    user.save();

    const messages = {
      uz: '✅: Buyurtma qabul qilindi',
      en: '✅: Order accepted',
      ru: '✅: Заказ принят',
    };

    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      `🎮: <b>${order.game_type.split('_')[0]}</b>\n` +
        `🆔: <code>${order.game_id}</code>\n` +
        `💸: ${order.amount}\n` +
        `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
        `${messages[ctx.session.lang]}`,
      {
        parse_mode: 'HTML',
      }
    );

    await ctx.api.sendMessage(
      '@tez_donat_buyurtmalar',
      `👤: ${user.email} \n` +
        `🎮: <b>${order.game_type}</b>\n` +
        `🆔: <code>${order.game_id}</code>\n` +
        `💸: ${order.amount}\n` +
        `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
        `🆕: Yangi buyurtma`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: `✅ To'lab berdim`, callback_data: `paid=${order.id}` },
              {
                text: `❌ Bekor qildim`,
                callback_data: `did_not_pay=${order.id}`,
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};

export const cancelOrder = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const order = await Order.findOne({ where: { id } });

    const messages = {
      uz: '❌: Buyurtma bekor qilindi',
      en: '❌: Order canceled',
      ru: '❌: Заказ отменён',
    };

    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      `🎮: <b>${order.game_type.split('_')[0]}</b>\n` +
        `🆔: <code>${order.game_id}</code>\n` +
        `💸: ${order.amount}\n` +
        `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
        `${messages[ctx.session.lang]}`,
      {
        parse_mode: 'HTML',
      }
    );

    await order.destroy();
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};

export const paidCommand = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const order = await Order.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: order.user_id } });
    const admin = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const messages = {
      uz: `✅: Buyurtmangizni to'lab berdik`,
      en: '✅: Your order has been paid',
      ru: '✅: Ваш заказ оплачен',
    };

    if (admin.role == 'admin') {
      await ctx.api.editMessageText(
        '@tez_donat_buyurtmalar',
        ctx.update.callback_query.message.message_id,
        `👤: ${user.email} \n` +
          `🎮: <b>${order.game_type}</b>\n` +
          `🆔: <code>${order.game_id}</code>\n` +
          `💸: ${order.amount}\n` +
          `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `✅: To'lab berildi.`,
        {
          parse_mode: 'HTML',
        }
      );

      await ctx.api.sendMessage(
        user.telegram_id,
        `🎮: <b>${order.game_type.split('_')[0]}</b>\n` +
          `🆔: <code>${order.game_id}</code>\n` +
          `💸: ${order.amount}\n` +
          `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `${messages[user.language]}`,
        {
          parse_mode: 'HTML',
        }
      );
    } else {
      ctx.answerCallbackQuery({
        text: `Sizda "Admin" huquqlari mvjud emas`,
        show_alert: true,
      });
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};

export const didNotPayCommand = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const order = await Order.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: order.user_id } });
    const admin = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const messages = {
      uz: `❌: Buyurtmangizni bekor qildik`,
      en: '❌: Your order has been canceled',
      ru: '❌: Ваш заказ был отменён',
    };

    if (admin.role == 'admin') {
      await ctx.api.editMessageText(
        '@tez_donat_buyurtmalar',
        ctx.update.callback_query.message.message_id,
        `👤: ${user.email} \n` +
          `🎮: <b>${order.game_type}</b>\n` +
          `🆔: <code>${order.game_id}</code>\n` +
          `💸: ${order.amount}\n` +
          `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `❌: Bekor qilindi.`,
        {
          parse_mode: 'HTML',
        }
      );

      await ctx.api.sendMessage(
        user.telegram_id,
        `🎮: <b>${order.game_type.split('_')[0]}</b>\n` +
          `🆔: <code>${order.game_id}</code>\n` +
          `💸: ${order.amount}\n` +
          `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `${messages[user.language]}`,
        {
          parse_mode: 'HTML',
        }
      );
    } else {
      ctx.answerCallbackQuery({
        text: `Sizda "Admin" huquqlari mvjud emas`,
        show_alert: true,
      });
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message);
  }
};
