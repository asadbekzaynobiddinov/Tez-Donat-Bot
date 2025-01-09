/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();
export const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Database connected successfuyl !');
};
