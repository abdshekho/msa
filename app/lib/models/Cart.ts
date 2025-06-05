import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface ICartItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const CartSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
      syriaTimezoneSchemaOptions
);

// Calculate total price before saving
CartSchema.pre('save', function(next) {
  const cart = this;
  let total = 0;
  
  if (cart.items && cart.items.length > 0) {
    cart.items.forEach(item => {
      total += item.price * item.quantity;
    });
  }
  
  cart.totalPrice = total;
  next();
});

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;