import { connectDb } from './database/index.js';
import { bot } from './bot/index.js';

async function bootstrap() {
  connectDb();
  bot.start()
}

bootstrap();
