import { InlineKeyboard } from 'grammy';
import { Order, User } from '../models/index.js';

export const orderConversation = async (conversations, ctx) => {
  try {
    if (
      ctx.session.lastMessage &&
      ctx.session.lastMessage.message_id ==
        ctx.update.callback_query.message.message_id
    ) {
      if (!ctx.session.lang) {
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

      // if(currentUser.balance < price) {
      //   return await ctx.reply(balanceMessage[ctx.session.lang])
      // }

      const idMeessage = {
        uz: `Iltimos ID raqamingizni kiriting: `,
        en: `Please enter your ID number:`,
        ru: 'Пожалуйста, введите свой идентификационный номер:',
      };

      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        idMeessage[ctx.session.lang]
      );

      const { message } = await conversations.wait();
      const gameId = message.text;

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

        await ctx.reply(
          `🎮: <b>${newOrder.game_type.split('_')[0]}</b>\n` +
            `🆔: <code>${gameId}</code>\n` +
            `💸: ${newOrder.amount}\n` +
            `💵: ${newOrder.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`,
          {
            parse_mode: 'HTML',
            reply_markup: buttons[ctx.session.lang],
          }
        );
      } catch (error) {
        ctx.api.sendMessage('@bots_errors', error.message);
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
