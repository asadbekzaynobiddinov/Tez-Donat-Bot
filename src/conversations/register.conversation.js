/* eslint-disable no-undef */
/* eslint-disable no-constant-condition */
import { Keyboard } from 'grammy';
import { config } from 'dotenv';
import { User, Promocode } from '../models/index.js';
import { hashPassword } from '../utils/index.js';
import { startCommand } from '../commands/start.command.js';

config();

export const registerConversation = async (conversation, ctx) => {
  let emailMessage;
  let email;

  let passwordMessage;
  let password;

  let contactMessage;
  let phone_number;

  let promocodeMessage;
  let promocode;

  switch (ctx.session.lang) {
    case 'uz': {
      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        'Emailingizni kiriting 📧\nMasalan: ( tezdonat_bot@gmail.com )'
      );
      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!email || !emailRegex.test(email)) {
          ctx.session.lastMessage = await ctx.reply(
            `Emailni to'g'ri formatda kiriting 🤦🏻‍♂️`
          );
          continue;
        }

        const currentUser = await User.findAll({ where: { email } });
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            'Bu email band qilingan 😔.\nBoshqa kiriting:'
          );
        }
      } while (true);

      ctx.session.lastMessage = await ctx.reply(
        `Yaxshi. 🤙🏻\nEndi esa yodda qolarli parol o'ylab toping. 🔒\nParol kamida 6 ta belgidan iborat bo'lsin.`
      );

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (!password || password.length >= 6) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            `Parol kamida 6 ta belgidan iborat bo'lishi kerak 🤦🏻‍♂️`
          );
        }
      } while (true);

      const numberKeyUz = new Keyboard()
        .requestContact('Telefon raqamni ulashish 📲')
        .oneTime()
        .resized();

      ctx.session.lastMessage = await ctx.reply(
        'Barakalla. 👍🏻\nEndi <b>Telefon raqamni ulashish 📲</b> tugmasini bosing:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyUz,
        }
      );

      do {
        contactMessage = await conversation.wait();
        if (!contactMessage.message.contact) {
          await ctx.reply('Iltimos tugmani bosing', {
            reply_markup: numberKeyUz,
          });
          continue;
        }
        phone_number = contactMessage.message.contact.phone_number;
        break;
      } while (true);

      ctx.session.lastMessage = await ctx.reply(
        `Ajoyib. 👌🏻\nEndi asosiy qism. \nPromokod bo'lsa kiriting 🎟️\nYo'q bo'lsa shunchaki yo'q deng. 🤫`
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      break;
    }

    case 'en': {
      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        'Enter your email 📧\nFor example: (tezdonat_bot@gmail.com)'
      );

      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!email || !emailRegex.test(email)) {
          ctx.session.lastMessage = await ctx.reply(
            `Please enter a valid email format 🤦🏻‍♂️`
          );
          continue;
        }

        const currentUser = await User.findAll({ where: { email } });
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            'This email is already taken 😔.\nPlease enter another one:'
          );
        }
      } while (true);

      ctx.session.lastMessage = await ctx.reply(
        'Great. 🤙🏻\nNow think of a memorable password. 🔒\nThe password must be at least 6 characters long.'
      );

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (!password || password.length >= 6) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            'The password must be at least 6 characters long 🤦🏻‍♂️'
          );
        }
      } while (true);

      const numberKeyEn = new Keyboard()
        .requestContact('Share phone number 📲')
        .oneTime()
        .resized();

      ctx.session.lastMessage = await ctx.reply(
        'Well done. 👍🏻\nNow press the <b>Share phone number 📲</b> button:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyEn,
        }
      );

      do {
        contactMessage = await conversation.wait();
        if (!contactMessage.message.contact) {
          await ctx.reply('Please press the button.', {
            reply_markup: numberKeyEn,
          });
          continue;
        }
        phone_number = contactMessage.message.contact.phone_number;
        break;
      } while (true);

      ctx.session.lastMessage = await ctx.reply(
        'Excellent. 👌🏻\nNow the main part. \nIf you have a promo code, enter it 🎟️\nIf not, simply say no. 🤫'
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      break;
    }

    case 'ru': {
      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.update.callback_query.message.message_id,
        'Введите ваш email 📧\nНапример: ( tezdonat_bot@gmail.com )'
      );

      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!email || !emailRegex.test(email)) {
          ctx.session.lastMessage = await ctx.reply(
            `Пожалуйста, введите правильный формат email 🤦🏻‍♂️`
          );
          continue;
        }

        const currentUser = await User.findAll({ where: { email } });
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            'Этот email уже занят 😔.\nВведите другой:'
          );
        }
      } while (true);

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (!password || password.length >= 6) {
          break;
        } else {
          ctx.session.lastMessage = await ctx.reply(
            'Пароль должен содержать минимум 6 символов 🤦🏻‍♂️'
          );
        }
      } while (true);

      const numberKeyRu = new Keyboard()
        .requestContact('Поделиться номером телефона 📲')
        .oneTime()
        .resized();

      ctx.session.lastMessage = await ctx.reply(
        'Отлично. 👍🏻\nТеперь нажмите кнопку <b>Поделиться номером телефона 📲</b>:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyRu,
        }
      );

      do {
        contactMessage = await conversation.wait();
        if (!contactMessage.message.contact) {
          await ctx.reply('Пожалуйста, нажмите кнопку.', {
            reply_markup: numberKeyRu,
          });
          continue;
        }
        phone_number = contactMessage.message.contact.phone_number;
        break;
      } while (true);

      ctx.session.lastMessage = await ctx.reply(
        'Прекрасно. 👌🏻\nТеперь основная часть. \nЕсли у вас есть промокод, введите его 🎟️\nЕсли нет, просто скажите «нет» 🤫'
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      break;
    }
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

      ctx.session.lastMessage = await ctx.reply(langMessage, {
        reply_markup: langKeys,
      });
      return;
    }
  }

  let thisPromocode;

  try {
    thisPromocode = await Promocode.findOne({ where: { content: promocode } });
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }

  let balance = 0;

  if (thisPromocode) {
    balance = thisPromocode.amount;
  }

  password = await hashPassword(password);

  const currentUser = {
    telegram_id: ctx.from.id,
    first_name: ctx.from.first_name || 'unknown',
    last_name: ctx.from.last_name || 'unknown',
    username: ctx.from.username || 'unknown',
    email,
    password,
    phone_number: phone_number || 'unknown',
    balance,
    language: ctx.session.lang,
  };

  try {
    await User.create(currentUser);
  } catch (error) {
    ctx.api.sendMessage(process.env.ERRORS_CHANEL, error.message);
  }
  startCommand(ctx);
};
