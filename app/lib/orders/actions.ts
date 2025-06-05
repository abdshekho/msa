'use server';

import { getServerSession } from 'next-auth';
import connectToDatabase from '../DB/mongoDB';
import Cart from '../models/Cart';
import Order from '../models/Order';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { authOptions } from "../../api/auth/[...nextauth]/route";

// Get orders for current user
export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return [];
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'items.product',
        select: 'name nameAr price imageCover'
      });
    
    // return orders;
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get a single order by ID
export async function getOrderById(orderId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to view orders');
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate({
      path: 'items.product',
      select: 'name nameAr price imageCover'
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return  JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Create a new order from cart
export async function createOrder(shippingAddress: {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  // country: string;
  phone: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to create an order');
    }
    
    await connectToDatabase();
    
    // Get user's cart
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price'
      });
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Your cart is empty');
    }
    
    // Create order from cart
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: cart.totalPrice,
      shippingAddress
    });
    
    await order.save();
    
    // Clear the cart after order is created
    cart.items = [];
    await cart.save();
    
    revalidatePath('/[lang]/orders');
    revalidatePath('/[lang]/cart');
    
    // return { success: true, orderId: order._id };
    return { success: true, orderId: JSON.parse(JSON.stringify(order._id)) };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
}

// Cancel an order
export async function cancelOrder(orderId: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      throw new Error('You must be logged in to cancel an order');
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error('This order cannot be cancelled');
    }
    
    order.status = 'cancelled';
    await order.save();
    
    revalidatePath('/[lang]/orders');
    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: error.message };
  }
}