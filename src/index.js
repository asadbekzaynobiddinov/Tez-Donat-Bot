import sequelize from './database/index.js'
import { bot } from './bot/index.js';

async function bootstrap() {
  await sequelize.authenticate();
  console.log('Postgres connected')
  bot.start()
}

bootstrap();
