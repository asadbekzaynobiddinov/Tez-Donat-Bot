import { connectDb } from './database/index.js';

async function bootstrap() {
  connectDb();
}

bootstrap();
