import { InlineKeyboard, Keyboard } from 'grammy';

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
    .text('MOBILE LEGENDS', 'mlbb')
    .row()
    .text('CLASH OF CLANS', 'clash');

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
    default:
      {
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
};

export const shopDepartments = async (ctx) => {
  try {
    if (ctx.session.lastMessage && ctx.session.lastMessage.message_id != ctx.update.callback_query.message.message_id) {
      console.log('eski habar')
    } else if (!ctx.session.lastMessage){
      console.log('eski habar yoq')
    } else {
      console.log('yangi habar')
    }
  } catch (error) {
    ctx.api.sendMessage('@bots_errors', error.message)    
  }
}
