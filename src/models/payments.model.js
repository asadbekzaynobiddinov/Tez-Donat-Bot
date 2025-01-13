import { DataTypes } from 'sequelize';
import sequelize from '../database/index.js';
import { User } from './user.model.js';

export const Payment = sequelize.define(
  'Payments',
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    image_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'payments',
  }
);

Payment.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(Payment, { as: 'payments', foreignKey: 'user_id' });
