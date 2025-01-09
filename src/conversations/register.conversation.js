/* eslint-disable no-constant-condition */
import { Keyboard } from "grammy";
import { User, Promocode } from "../schemas/index.js";
import { hashPassword } from "../utils/index.js";

export const registerConversation = async (
  conversation, ctx
) => {
  let emailMessage;
  let email;

  let passwordMessage;
  let password;

  let contactMessage;
  let phone_number;

  let promocodeMessage;
  let promocode;

  switch (ctx.session.lang) {
    case 'uz':
      { await ctx.reply(
        'Emailingizni kiriting 📧\nMasalan: ( tezdonat_bot@gmail.com )',
      );
      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
          ctx.reply(`Emailni to'g'ri formatda kiriting 🤦🏻‍♂️`);
          continue;
        }

        const currentUser = await User.findAll({ where: { email }});
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.reply('Bu email band qilingan 😔.\nBoshqa kiriting:');
        }
      } while (true);

      await ctx.reply(
        `Yaxshi. 🤙🏻\nEndi esa yodda qolarli parol o'ylab toping. 🔒\nParol kamida 6 ta belgidan iborat bo'lsin.`,
      );

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (password.length >= 6) {
          break;
        } else {
          ctx.reply(`Parol kamida 6 ta belgidan iborat bo'lishi kerak 🤦🏻‍♂️`);
        }
      } while (true);

      const numberKeyUz = new Keyboard()
        .requestContact('Telefon raqamni ulashish 📲')
        .oneTime()
        .resized();

      await ctx.reply(
        'Barakalla. 👍🏻\nEndi <b>Telefon raqamni ulashish 📲</b> tugmasini bosing:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyUz,
        },
      );

      contactMessage = await conversation.wait();
      phone_number = contactMessage.message.contact.phone_number;

      await ctx.reply(
        `Ajoyib. 👌🏻\nEndi asosiy qism. \nPromokod bo'lsa kiriting 🎟️\nYo'q bo'lsa shunchaki yo'q deng. 🤫`,
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      await ctx.reply(
        `Tabriklayman 🥳. \nRo'yxatdan o'tishni amalga oshirdingz 🎉.\nEndi tizimga kirishingiz kerak 😁.\nBu havfsizlik uchun albatta 👮🏻‍♂️.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Tizimga kirish', callback_data: 'login' }],
            ],
          },
        },
      );
      break; }

    case 'en':
      { await ctx.reply(
        'Enter your email 📧\nFor example: (tezdonat_bot@gmail.com)',
      );

      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
          ctx.reply(`Please enter a valid email format 🤦🏻‍♂️`);
          continue;
        }

        const currentUser = await User.findAll({ where: { email } });
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.reply(
            'This email is already taken 😔.\nPlease enter another one:',
          );
        }
      } while (true);

      await ctx.reply(
        'Great. 🤙🏻\nNow think of a memorable password. 🔒\nThe password must be at least 6 characters long.',
      );

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (password.length >= 6) {
          break;
        } else {
          ctx.reply('The password must be at least 6 characters long 🤦🏻‍♂️');
        }
      } while (true);

      const numberKeyEn = new Keyboard()
        .requestContact('Share phone number 📲')
        .oneTime()
        .resized();

      await ctx.reply(
        'Well done. 👍🏻\nNow press the <b>Share phone number 📲</b> button:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyEn,
        },
      );

      contactMessage = await conversation.wait();
      phone_number = contactMessage.message.contact.phone_number;

      await ctx.reply(
        'Excellent. 👌🏻\nNow the main part. \nIf you have a promo code, enter it 🎟️\nIf not, simply say no. 🤫',
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      await ctx.reply(
        `Congratulations 🥳. \nYou’ve successfully registered 🎉.\nNow, you need to log in 😁.\nThis is for security purposes, of course 👮🏻‍♂️.`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: 'Log In', callback_data: 'login' }]],
          },
        },
      );
      break; }

    case 'ru':
      { await ctx.reply(
        'Введите ваш email 📧\nНапример: ( tezdonat_bot@gmail.com )',
      );

      do {
        emailMessage = await conversation.wait();
        email = emailMessage.message.text;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
          ctx.reply(`Пожалуйста, введите правильный формат email 🤦🏻‍♂️`);
          continue;
        }

        const currentUser = await User.findAll({ where: { email } });
        if (currentUser.length === 0) {
          break;
        } else {
          ctx.reply('Этот email уже занят 😔.\nВведите другой:');
        }
      } while (true);

      do {
        passwordMessage = await conversation.wait();
        password = passwordMessage.message.text;
        if (password.length >= 6) {
          break;
        } else {
          ctx.reply('Пароль должен содержать минимум 6 символов 🤦🏻‍♂️');
        }
      } while (true);

      const numberKeyRu = new Keyboard()
        .requestContact('Поделиться номером телефона 📲')
        .oneTime()
        .resized();

      await ctx.reply(
        'Отлично. 👍🏻\nТеперь нажмите кнопку <b>Поделиться номером телефона 📲</b>:',
        {
          parse_mode: 'HTML',
          reply_markup: numberKeyRu,
        },
      );

      contactMessage = await conversation.wait();
      phone_number = contactMessage.message.contact.phone_number;

      await ctx.reply(
        'Прекрасно. 👌🏻\nТеперь основная часть. \nЕсли у вас есть промокод, введите его 🎟️\nЕсли нет, просто скажите «нет» 🤫',
      );

      promocodeMessage = await conversation.wait();
      promocode = promocodeMessage.message.text;

      await ctx.reply(
        `Поздравляю 🥳. \nВы успешно зарегистрировались 🎉.\nТеперь вам нужно войти в систему 😁.\nЭто, конечно, для безопасности 👮🏻‍♂️.`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: 'Войти', callback_data: 'login' }]],
          },
        },
      );

      break; }
    default:
      break;
  }

  const thisPromocode = await Promocode.findOne({ where: { content: promocode } })

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
    phone_number,
    balance,
  };

  const newUser = await User.create(currentUser)
  console.log(newUser)
  return;
};
