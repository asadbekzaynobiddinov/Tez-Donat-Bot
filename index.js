import sequelize from './src/database/index.js';
import { bot } from './src/bot/index.js';

async function bootstrap() {
  await sequelize.authenticate();
  await sequelize.sync();

  bot.start();
  console.log('Webhock was set')
}

bootstrap();