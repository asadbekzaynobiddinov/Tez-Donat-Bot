import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

const UserRoles = {
  user: 'user',
  admin: 'admin',
};

export const User = sequelize.define(
  'User',
  {
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 15],
      },
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM(Object.values(UserRoles)),
      defaultValue: UserRoles.user,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

