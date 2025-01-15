/* eslint-disable no-undef */
import { InlineKeyboard } from 'grammy';
import { config } from 'dotenv';
import { User, Payment } from '../models/index.js';

config();

export const startPayment = async (ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const message1 = {
      uz: `Sizda hali tasdiqlanmagan o'tkazma mavjud. \nIltimos, tasdiqlanishini kuting.`,
      en: `You have an unconfirmed transfer. \nPlease wait for it to be confirmed.`,
      ru: `У вас есть неподтвержденный перевод. \nПожалуйста, дождитесь его подтверждения.`,
    };

    if (user.payment_status) {
      ctx.session.lastMessage = await ctx.reply(message1[user.language]);
      return;
    }

    const message2 = {
      uz: `☟ Kereakli bo'limni tanlang:`,
      en: `☟ Select the desired section:`,
      ru: `☟ Выберите нужный раздел:`,
    };

    const buttons = {
      uz: new InlineKeyboard()
        .text(`Rossiyadan O'zbekistonga AloqaBank`, 'ru-uz')
        .row()
        .text(`O'zbekiston hududidan AloqaBank`, 'uz-uz'),
      en: new InlineKeyboard()
        .text(`AloqaBank from Russia to Uzbekistan`, 'ru-uz')
        .row()
        .text(`AloqaBank within Uzbekistan`, 'uz-uz'),
      ru: new InlineKeyboard()
        .text(`АлоқаБанк из России в Узбекистан`, 'ru-uz')
        .row()
        .text(`АлоқаБанк в пределах Узбекистана`, 'uz-uz'),
    };

    ctx.session.lastMessage = await ctx.reply(message2[user.language], {
      reply_markup: buttons[user.language],
    });
    return;
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const paymentDepartments = async (ctx) => {
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
    ctx.session.lastMessage = await ctx.reply(
      `<code>9860190112424188</code>\n` +
        `Alimov Hoshim\n` +
        `Aloqa bank\n` +
        `<code>+998907015500</code>`,
      {
        parse_mode: 'HTML',
      }
    );
    await ctx.conversation.enter('paymentConversation');
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const acceptPayment = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    console.log(ctx.update.callback_query.data);
    const payment = await Payment.findOne({ where: { id } });
    const user = await User.findOne({ where: { id: payment.user_id } });
    const admin = await User.findOne({ where: { telegram_id: ctx.from.id } });
    if (admin.role != 'admin') {
      ctx.answerCallbackQuery({
        text: `Sizda "Admin" huquqlari mvjud emas`,
        show_alert: true,
      });
      return;
    }
    const messages = {
      uz: [
        'Hisob toldirish haqidagi arizangiz qabul qilindi',
        'email',
        'hisob',
      ],
      en: [
        'Your request for balance replenishment has been received',
        'email',
        'balance',
      ],
      ru: [
        'Ваш запрос на пополнение счета принят',
        'электронная почта',
        'баланс',
      ],
    };

    let newBalance = parseInt(user.balance);
    newBalance += parseInt(payment.amount);

    await User.update(
      {
        balance: newBalance,
        payment_status: false,
      },
      {
        where: { id: payment.user_id },
      }
    );

    await ctx.api.editMessageCaption(
      process.env.PAYMENTS_CHANEL,
      ctx.update.callback_query.message.message_id,
      {
        caption:
          `Email: ${user.email}\n` +
          `Telefon: ${user.phone_number}\n` +
          `Miqdor: ${payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `✅: Tasdiqlangan`,
      }
    );

    await ctx.api.sendMessage(
      user.telegram_id,
      `${messages[user.language][0]}\n${messages[user.language][1]}: ${user.email}\n${messages[user.language][2]}: ${newBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`
    );
  } catch (error) {
    console.log(error);
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};

export const rejectPaynment = async (ctx) => {
  try {
    const [, id] = ctx.update.callback_query.data.split('=');
    const payment = await Payment.findOne({ where: { id } });
    console.log(id);
    const user = await User.findOne({ where: { id: payment.user_id } });
    const admin = await User.findOne({ where: { telegram_id: ctx.from.id } });
    if (admin.role != 'admin') {
      ctx.answerCallbackQuery({
        text: `Sizda "Admin" huquqlari mvjud emas`,
        show_alert: true,
      });
      return;
    }
    const messages = {
      uz: [
        'Hisob toldirish haqidagi arizangiz bekor qilindi',
        'email',
        'hisob',
      ],
      en: [
        'Your request for balance replenishment has been canceled',
        'email',
        'balance',
      ],
      ru: [
        'Ваш запрос на пополнение счета отменен',
        'электронная почта',
        'баланс',
      ],
    };

    await User.update(
      {
        payment_status: false,
      },
      { where: { id: user.id } }
    );

    await ctx.api.sendMessage(
      user.telegram_id,
      `${messages[user.language][0]}\n${messages[user.language][1]}: ${user.email}\n${messages[user.language][2]}: ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm`
    );

    await ctx.api.editMessageCaption(
      process.env.PAYMENTS_CHANEL,
      ctx.update.callback_query.message.message_id,
      {
        caption:
          `Email: ${user.email}\n` +
          `Telefon: ${user.phone_number}\n` +
          `Miqdor: ${payment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} so'm\n` +
          `❌: Bekor qilingan`,
      }
    );

    await payment.destroy();
  } catch (error) {
    console.log(error);
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};
