/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */
import { Payment, User } from '../models/index.js';
import { config } from 'dotenv';
import {
  profileCommmand,
  startCommand,
  shopCommand,
  changeLang,
  startPayment,
  helpCommand,
  manualCommand,
} from '../commands/index.js';

config();

export const paymentConversation = async (conversation, ctx) => {
  try {
    const user = await User.findOne({ where: { telegram_id: ctx.from.id } });

    const message1 = {
      uz: [
        "tepadagi kartaga to'lov qilganingizdan so'ng.\n\n" +
          "— jo'natgan pulingizni YOZMA ko'rinishda yuboring. " +
          "Nuqta(.) vergul(,) ishlatmasdan jo'nating, " +
          "na'muna: 10000",
        "Iltimos, to'g'ri summa kiriting (faqat raqam, (.) va (,) siz).",
      ],
      en: [
        'After making the payment to the card above.\n\n' +
          '— Send the amount you transferred in WRITTEN form. ' +
          'Do not use a period (.) or comma (,), ' +
          'example: 10000',
        'Please enter the correct amount (numbers only, without (.) or (,)).',
      ],
      ru: [
        'После оплаты на указанную карту.\n\n' +
          '— Отправьте сумму перевода в ПИСЬМЕННОМ виде. ' +
          'Не используйте точку (.) или запятую (,), ' +
          'пример: 10000',
        'Пожалуйста, введите правильную сумму (только цифры, без (.) или (,)).',
      ],
    };
    const message2 = {
      uz: [
        "Endi esa to'lov skrenshotini jo'nating.\nPDF yoki boshqa format qabul qilinmaydi.",
        'Iltimos, rasm yuboring.',
      ],
      en: [
        'Now, please send the payment screenshot.\nPDF or other formats are not accepted.',
        'Please send a picture.',
      ],
      ru: [
        'Теперь отправьте скриншот оплаты.\nPDF или другие форматы не принимаются.',
        'Пожалуйста, отправьте изображение.',
      ],
    };

    ctx.session.lastMessage = await ctx.reply(message1[user.language][0]);

    let amount;

    do {
      const { message } = await conversation.wait();
      amount = message.text;

      switch (amount) {
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
        case '/history':
        case '🌐 Buyurtmalar tarixi':
        case '🌐 Order History':
        case '🌐 История заказов':
          ordersHistory(ctx);
          return;
        case '/manual':
        case `📕 Qo'llanma`:
        case '📕 Manual':
        case '📕 Руководство':
          manualCommand(ctx);
          return;
        case '/help':
        case '☎️ Yordam uchun':
        case '☎️ Help':
        case '☎️ Помощь':
          helpCommand(ctx);
          return;
      }

      if (
        isNaN(amount) ||
        amount <= 0 ||
        amount.includes('.') ||
        amount.includes(',')
      ) {
        ctx.session.lastMessage = await ctx.reply(message1[user.language][1]);
      } else {
        break;
      }
    } while (true);

    ctx.session.lastMessage = await ctx.reply(message2[user.language][0]);
    let fileId;
    do {
      const { message } = await conversation.wait();

      if (message.photo && message.photo.length > 0) {
        const photo = message.photo;
        const largestPhoto = photo[photo.length - 1];
        fileId = largestPhoto.file_id;
        break;
      } else {
        ctx.session.lastMessage = await ctx.reply(message2[user.language][1]);
      }
    } while (true);

    const payment = {
      user_id: user.id,
      image_id: fileId,
      amount: parseInt(amount),
    };

    const newPayment = await Payment.create(payment);

    const message =
      `Email: ${user.email}\n` +
      `Telefon: ${user.phone_number}\n` +
      `Miqdor: ${newPayment.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    await ctx.api.sendPhoto(process.env.PAYMENTS_CHANEL, fileId, {
      caption: message,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '✅ Tasdiqlash',
              callback_data: `accept=${newPayment.id}`,
            },
            {
              text: '❌ Bekor qilish',
              callback_data: `reject=${newPayment.id}`,
            },
          ],
        ],
      },
    });

    const message3 = {
      uz: `Hisob to'ldirish haqida so'rovingiz qabul qilindi. \nTo'lov tekshirilib balansingizga tez orada pul tushadi!`,
      en: `Your request for balance replenishment has been received. \nThe payment will be verified, and the amount will be credited to your balance shortly!`,
      ru: `Ваш запрос на пополнение счета принят. \nПлатеж будет проверен, и деньги скоро поступят на ваш баланс!`,
    };

    await ctx.reply(message3[user.language]);
    await User.update(
      {
        payment_status: true,
      },
      {
        where: { id: user.id },
      }
    );
    return;
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
};
