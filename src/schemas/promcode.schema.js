import mongoose from 'mongoose';

const { Schema } = mongoose;

const promocodeSchema = new Schema({
  content: { type: String, unique: true, required: true },
  amount: { type: Number, required: true, unique: true },
  allowed_uses: { type: Number, required: true },
});

export const Promocode = mongoose.model('Promocode', promocodeSchema);

