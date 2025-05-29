'use server';

import { getServerSession } from 'next-auth';
import connectToDatabase from '../DB/mongoDB';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { revalidatePath } from 'next/cache';
import { authOptions } from "../../api/auth/[...nextauth]/route"
import mongoose from 'mongoose';
// Get cart for current user
export async function getCart() {
  try {
    const session = await getServerSession(authOptions);

    console.log('🚀 ~ actions.ts ~ getCart ~ session:', session);

    
    if (!session?.user?.email ||session?.user?.role === 'admin' ) {
      return { items: [], totalPrice: 0 };
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(userId)})
      .populate({
        path: 'items.product',
        select: 'name nameAr price imageCover'
      });
    
    if (!cart) {
      return { items: [], totalPrice: 0 };
    }
    
    return JSON.parse(JSON.stringify(cart));
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { items: [], totalPrice: 0 };
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to add items to cart');
    }
    
    await connectToDatabase();
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Find or create cart
    const userId = session.user.id.toString();
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0
      });
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    // Save cart
    await cart.save();
    
    revalidatePath('/[lang]/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error: error.message };
  }
}

// Update cart item quantity
export async function updateCartItem(itemId: string, quantity: number) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to update cart');
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    revalidatePath('/[lang]/cart');
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error: error.message };
  }
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to remove items from cart');
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );
    
    await cart.save();
    
    revalidatePath('/[lang]/cart');
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.message };
  }
}

// Clear cart
export async function clearCart() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to clear cart');
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: userId });
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    revalidatePath('/[lang]/cart');
    return { success: true };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, error: error.message };
  }
}