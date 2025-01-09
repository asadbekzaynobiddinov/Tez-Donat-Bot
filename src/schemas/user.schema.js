import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const UserRoles = {
  user: 'user',
  admin: 'admin',
};

const userSchema = new Schema({
  telegram_id: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone_number: { type: String, maxlength: 15, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, enum: Object.values(UserRoles), default: UserRoles.user },
});

export const User = model('User', userSchema);
