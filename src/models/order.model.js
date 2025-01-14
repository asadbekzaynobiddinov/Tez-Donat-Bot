import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';
import { User } from './user.model.js';

export const Order = sequelize.define(
  'Order',
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    game_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    other: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'orders',
  }
);

Order.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(Order, { as: 'orders', foreignKey: 'user_id' });
