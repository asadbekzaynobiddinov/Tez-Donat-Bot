/* eslint-disable no-undef */
import { InlineKeyboard } from 'grammy';
import { config } from 'dotenv';
import { Order, User } from '../models/index.js';
import {
  startCommand,
  shopCommand,
  changeLang,
  profileCommmand,
  startPayment,
} from '../commands/index.js';

config()

export const orderConversation = async (conversations, ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id ==
        ctx.update.callback_query.message.message_id
    ) {
      const currentUser = await User.findOne({
        where: { telegram_id: ctx.from.id },
      });

      const [, gameType, price, amount, other] =
        ctx.update.callback_query.data.split('=');

      const balanceMessage = {
        uz: `Hisobingizda yetarli mablag' mavjud emas.`,
        en: `Insufficient funds in your account.`,
        ru: 'На вашем счете недостаточно средств.',
      };

      if (parseInt(currentUser.balance) < parseInt(price)) {
        await ctx.api.editMessageText(
          ctx.from.id,
          ctx.update.callback_query.message.message_id,
          balanceMessage[currentUser.language]
        );
        return;
      }

      const idMeessage = {
        uz: `Iltimos ID raqamingizni kiriting: `,
        en: `Please enter your ID number:`,
        ru: 'Пожалуйста, введите свой идентификационный номер:',
      };

      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        idMeessage[currentUser.language]
      );

      const { message } = await conversations.wait();
      const gameId = message.text;

      switch (gameId) {
        case '/start':
          startCommand(ctx);
          return;
        case `🛒 Do'kon`:
        case '🛒 Shop':
        case '🛒 Магазин':
          shopCommand(ctx);
          return;
        case `🌍 Tilni o'zgartirish`:
        case '🌍 Change Language':
        case '🌍 Сменить язык':
          changeLang(ctx);
          return;
        case '👤 Kabinet':
        case '👤 Profile':
        case '👤 Профиль':
          profileCommmand(ctx);
          return;
        case `💰 Xisob to'ldirish`:
        case '💰 Recharge Account':
        case '💰 Пополнение счета':
          startPayment(ctx);
          return;
      }

      try {
        const order = {
          user_id: currentUser.id,
          game_type: gameType,
          game_id: gameId,
          price,
          amount,
          other: other ? other : null,
        };
        const newOrder = await Order.create(order);

        const buttons = {
          uz: new InlineKeyboard()
            .text('Sotib olish', `buy=${newOrder.id}`)
            .text('Bekor qilish', `cancel=${newOrder.id}`),
          en: new InlineKeyboard()
            .text(`Buy`, `buy=${newOrder.id}`)
            .text('Cancel', `cancel=${newOrder.id}`),
          ru: new InlineKeyboard()
            .text('Купить', `buy=${newOrder.id}`)
            .text('Отмена', `cancel=${newOrder.id}`),
        };

        ctx.session.lastMessage = await ctx.reply(
          `🎮: <b>${newOrder.game_type.split('_')[0]}</b>\n` +
            `🆔: <code>${gameId}</code>\n` +
            `💸: ${newOrder.amount}\n` +
            `💵: ${newOrder.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`,
          {
            parse_mode: 'HTML',
            reply_markup: buttons[currentUser.language],
          }
        );
      } catch (error) {
        ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
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
