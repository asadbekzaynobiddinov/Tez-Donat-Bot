/* eslint-disable no-undef */
import { Keyboard } from 'grammy';
import { fn, col, Op } from 'sequelize';
import { User, Order } from '../models/index.js';
import moment from 'moment';
import { config } from 'dotenv';

config();

export const ordersHistory = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });
    const skip = (ctx.session.page - 1) * 10;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.findAll({
      attributes: [
        [fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'orderDate'],
        [fn('COUNT', col('id')), 'orderCount'],
      ],
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      group: [fn('to_char', col('createdAt'), 'DD.MM.YYYY')],
      order: [[fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'ASC']],
      offset: skip,
      limit: ctx.session.limit,
    });

    const message = {
      uz: [
        'Sizda hali buyurtmalar mavjud emas',
        'Sizning buyurtmalar tarixingiz',
      ],
      en: ['You don’t have any orders yet', 'Your order history'],
      ru: ['У вас пока нет заказов', 'История ваших заказов'],
    };

    if (orders.length == 0) {
      return await ctx.reply(message[user.language][0]);
    }

    const inlineKeyboard = [];
    let row = [];

    for (let order of orders) {
      row.push({
        text: `${order.dataValues.orderDate}`,
        callback_data: `order=${order.dataValues.orderDate}`,
      });

      if (row.length === 2) {
        inlineKeyboard.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      inlineKeyboard.push(row);
    }

    const prewNext = [
      {
        text: '⬅️ Prev',
        callback_data: 'prev',
      },
      {
        text: 'Next ➡️',
        callback_data: 'next',
      },
    ];

    inlineKeyboard.push(prewNext);
    inlineKeyboard.push([
      {
        text: '❌ Cancel',
        callback_data: 'remove',
      },
    ]);

    ctx.session.lastMessage = await ctx.reply(message[user.language][1], {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const prevCommand = async (ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id !=
        ctx.update.callback_query.message.message_id
    ) {
      await ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id
      );
      return;
    }
    console.log(ctx.update.callback_query);

    ctx.session.page--;
    const skip = (ctx.session.page - 1) * ctx.session.limit;

    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const messages = {
      uz: "Siz ro'yxatning boshidasiz",
      en: 'You are at the beginning of the list',
      ru: 'Вы в начале списка',
    };

    if (skip < 0) {
      ctx.session.page++;
      return ctx.answerCallbackQuery({
        text: messages[user.language],
        show_alert: true,
      });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.findAll({
      attributes: [
        [fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'orderDate'],
        [fn('COUNT', col('id')), 'orderCount'],
      ],
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      group: [fn('to_char', col('createdAt'), 'DD.MM.YYYY')],
      order: [[fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'ASC']],
      offset: skip,
      limit: ctx.session.limit,
    });

    const message = {
      uz: 'Sizning buyurtmalar tarixingiz',
      en: 'Your order history',
      ru: 'История ваших заказов',
    };

    const inlineKeyboard = [];
    let row = [];

    for (let order of orders) {
      row.push({
        text: `${order.dataValues.orderDate}`,
        callback_data: `order=${order.dataValues.orderDate}`,
      });

      if (row.length === 2) {
        inlineKeyboard.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      inlineKeyboard.push(row);
    }

    const prewNext = [
      {
        text: '⬅️ Prev',
        callback_data: 'prev',
      },
      {
        text: 'Next ➡️',
        callback_data: 'next',
      },
    ];

    inlineKeyboard.push(prewNext);
    inlineKeyboard.push([
      {
        text: '❌ Cancel',
        callback_data: 'remove',
      },
    ]);

    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      message[user.language],
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }
    );
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const nextCommand = async (ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id !=
        ctx.update.callback_query.message.message_id
    ) {
      await ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id
      );
      return;
    }

    ctx.session.page++;
    const skip = (ctx.session.page - 1) * ctx.session.limit;

    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const messages = {
      uz: "Siz ro'yxatning oxiridasiz",
      en: 'You are at the end of the list',
      ru: 'Вы в конце списка',
    };

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.findAll({
      attributes: [
        [fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'orderDate'],
        [fn('COUNT', col('id')), 'orderCount'],
      ],
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      group: [fn('to_char', col('createdAt'), 'DD.MM.YYYY')],
      order: [[fn('to_char', col('createdAt'), 'DD.MM.YYYY'), 'ASC']],
      offset: skip,
      limit: ctx.session.limit,
    });

    if (orders.length == 0) {
      ctx.session.page--;
      return ctx.answerCallbackQuery({
        text: messages[user.language],
        show_alert: true,
      });
    }

    const message = {
      uz: 'Sizning buyurtmalar tarixingiz',
      en: 'Your order history',
      ru: 'История ваших заказов',
    };

    const inlineKeyboard = [];
    let row = [];

    for (let order of orders) {
      row.push({
        text: `${order.dataValues.orderDate}`,
        callback_data: `order=${order.dataValues.orderDate}`,
      });

      if (row.length === 2) {
        inlineKeyboard.push(row);
        row = [];
      }
    }

    if (row.length > 0) {
      inlineKeyboard.push(row);
    }

    const prewNext = [
      {
        text: '⬅️ Prev',
        callback_data: 'prev',
      },
      {
        text: 'Next ➡️',
        callback_data: 'next',
      },
    ];

    inlineKeyboard.push(prewNext);
    inlineKeyboard.push([
      {
        text: '❌ Cancel',
        callback_data: 'remove',
      },
    ]);

    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      message[user.language],
      {
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }
    );
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const orderButtons = async (ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id !=
        ctx.update.callback_query.message.message_id
    ) {
      await ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id
      );
      return;
    }

    const message = {
      uz: 'Xarid qilinganlar:',
      en: 'Purchased items:',
      ru: 'Купленные товары:',
    };

    const [, date] = ctx.update.callback_query.data.split('=');
    const formattedDate = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD');

    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const orders = await Order.findAll({
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: new Date(`${formattedDate}T00:00:00`),
          [Op.lt]: new Date(`${formattedDate}T23:59:59`),
        },
      },
    });

    const orderMessage = {
      uz: '✅: Buyurtma bajarilgan',
      en: '✅: Order completed',
      ru: '✅: Заказ выполнен',
    };

    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      message[user.language]
    );

    for (let order of orders) {
      const message =
        `🎮: <b>${order.game_type.split('_')[0]}</b>\n` +
        `🆔: <code>${order.game_id}</code>\n` +
        `💸: ${order.amount}\n` +
        `💵: ${order.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
        `${order.other ? order.other : ''}` +
        `${orderMessage[user.language]}`;
      await ctx.reply(message, {
        parse_mode: 'HTML',
      });
    }
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const removeOrderButtons = async (ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id !=
        ctx.update.callback_query.message.message_id
    ) {
      await ctx.api.deleteMessage(
        ctx.from.id,
        ctx.update.callback_query.message.message_id
      );
      return;
    }

    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const message = {
      uz: `☟ Kereakli bo'limni tanlang:`,
      en: `☟ Select the desired section:`,
      ru: `☟ Выберите нужный раздел:`,
    };

    const buttons = {
      uz: new Keyboard()
        .text(`🛒 Do'kon`)
        .text('👤 Kabinet')
        .row()
        .text('🌐 Buyurtmalar tarixi')
        .text(`💰 Xisob to'ldirish`)
        .row()
        .text(`📕 Qo'llanma`)
        .text('☎️ Yordam uchun')
        .row()
        .resized(),
      en: new Keyboard()
        .text('🛒 Shop')
        .text('👤 Profile')
        .row()
        .text('🌐 Order History')
        .text('💰 Recharge Account')
        .row()
        .text('📕 Manual')
        .text('☎️ Help')
        .resized(),
      ru: new Keyboard()
        .text('🛒 Магазин')
        .text('👤 Профиль')
        .row()
        .text('🌐 История заказов')
        .text('💰 Пополнение счета')
        .row()
        .text('📕 Руководство')
        .text('☎️ Помощь')
        .row()
        .resized(),
    };

    await ctx.editMessageText(
      ctx.from.id,
      ctx.update.callback_query.message.message_id,
      message[(user, language)],
      {
        reply_markup: buttons[user.language],
      }
    );

    return;
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};
