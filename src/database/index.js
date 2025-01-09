/* eslint-disable no-undef */
import { config } from 'dotenv';

config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  sync: true,
  logging: false,
})

export default sequelize
