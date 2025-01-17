import { webhookCallback } from 'grammy';
import express from 'express';
import sequelize from './src/database/index.js';
import { bot } from './src/bot/index.js';

const app = express();

app.use(express.json());

app.use('/bot', webhookCallback(bot));

async function bootstrap() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
    bot.api.setWebhook('https://bot.takedaservice.uz:3001/bot').then(() => {
      console.log('Webhook is set successfully');
    }).catch((err) => {
      console.error('Error setting webhook:', err);
    });
  });
}

bootstrap();