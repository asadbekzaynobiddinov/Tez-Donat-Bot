import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

export const Promocode = sequelize.define(
  'Promocode',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    allowed_uses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'promocodes',
    timestamps: true,
  }
);
