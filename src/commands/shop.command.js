/* eslint-disable no-undef */
import { InlineKeyboard } from 'grammy';
import { config } from 'dotenv';
import {
  freeFire,
  mobileLegendsTurk,
  mobileLegendsSng,
  pubg,
} from '../inline-keys/index.js';
import { User, Order } from '../models/index.js';

config()

export const shopCommand = async (ctx) => {
  const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
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

  ctx.session.lastMessage = await ctx.reply(message[user.language], {
    reply_markup: keys,
  });
  return;
};

export const shopDepartments = async (ctx, command) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
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
          ctx.session.lastMessage = await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[user.language],
            {
              reply_markup: pubg,
            }
          );
          break;
        case 'ff':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[user.language],
            {
              reply_markup: freeFire,
            }
          );
          break;
        case 'mlbb_sng':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[user.language],
            {
              reply_markup: mobileLegendsSng,
            }
          );
          break;
        case 'mlbb_turk':
          await ctx.api.editMessageText(
            ctx.from.id,
            ctx.update.callback_query.message.message_id,
            messages[user.language],
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
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const buyOrder = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const order = await Order.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: order.user_id } });

    let newBalance = +user.balance;
    let orderPrice = +order.price;
    newBalance -= orderPrice;
    await User.update({ balance: newBalance }, { where: { id: user.id } });

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
        `${messages[user.language]}`,
      {
        parse_mode: 'HTML',
      }
    );

    await ctx.api.sendMessage(
      process.env.ORDERS_CHANEL,
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
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const cancelOrder = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const user = await User.findAll({ where: { telegram_id: ctx.from.id } });
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
        `${messages[user.language]}`,
      {
        parse_mode: 'HTML',
      }
    );

    await order.destroy();
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
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
        process.env.ORDERS_CHANEL,
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
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
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
        process.env.ORDERS_CHANEL,
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

      let newBalance = +user.balance;
      let orderPrice = +order.price;
      newBalance += orderPrice;
      await User.update({ balance: newBalance }, { where: { id: user.id } });

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

      await order.destroy();
    } else {
      ctx.answerCallbackQuery({
        text: `Sizda "Admin" huquqlari mvjud emas`,
        show_alert: true,
      });
    }
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};


export const backKey = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id }})
    const messages = {
      uz: `☟ Kereakli bo'limni tanlang:`,
      en: `☟ Select the desired section:`,
      ru: '☟ Выберите нужный раздел:',
    };
    const keys = new InlineKeyboard()
    .text('PUBG MOBILE', 'pubg')
    .text('FREE FIRE', 'ff')
    .row()
    .text('MOBILE LEGENDS SNG', 'mlbb_sng')
    .row()
    .text('MOBILE LEGENDS TURK', 'mlbb_turk');

    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id !=
        ctx.update.callback_query.message.message_id
    ) {
      await ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
      );
    }
    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      messages[user.language], {
        reply_markup: keys
      }
    )
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message)
  }
}