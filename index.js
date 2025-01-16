import { webhookCallback } from 'grammy';
import express from 'express';
import sequelize from './src/database/index.js';
import { bot } from './src/bot/index.js';

const app = express();

app.use(express.json());

app.use(webhookCallback(bot, "express"));

async function bootstrap() {
  
  await sequelize.authenticate();
  await sequelize.sync();

  const endpoint = 'https://bot.takedaservice.uz'
  bot.start();
  console.log('Webhock was set')

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

bootstrap();