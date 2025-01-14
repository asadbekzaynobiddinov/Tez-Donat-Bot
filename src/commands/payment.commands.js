/* eslint-disable no-undef */
import { InlineKeyboard } from 'grammy';
import { User } from '../models/index.js';

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
