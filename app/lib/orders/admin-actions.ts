'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '../DB/mongoDB';
import Order from '../models/Order';
import User from '../models/User';
import { revalidatePath } from 'next/cache';

// Import User model to ensure it's registered before being referenced
import '../models/User';

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await connectToDatabase();

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    revalidatePath('/[lang]/dashboard/orders');
    revalidatePath(`/[lang]/dashboard/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

// Get order statistics for dashboard
// export async function getOrderStatistics() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.email || session.user.role !== 'admin') {
//       throw new Error('Unauthorized');
//     }

//     await connectToDatabase();

//     // Ensure User model is registered
//     await User.findOne();

//     // Count orders by status
//     const pendingCount = await Order.countDocuments({ status: 'pending' });
//     const processingCount = await Order.countDocuments({ status: 'processing' });
//     const shippedCount = await Order.countDocuments({ status: 'shipped' });
//     const deliveredCount = await Order.countDocuments({ status: 'delivered' });
//     const cancelledCount = await Order.countDocuments({ status: 'cancelled' });

//     // Get total revenue from completed orders
//     const completedOrders = await Order.find({ status: 'delivered' });
//     const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

//     // Get recent orders
//     const recentOrders = await Order.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name email')
//       .populate({
//         path: 'items.product',
//         select: 'name nameAr'
//       });

//     return {
//       success: true,
//       statistics: {
//         pendingCount,
//         processingCount,
//         shippedCount,
//         deliveredCount,
//         cancelledCount,
//         totalRevenue,
//         recentOrders: JSON.parse(JSON.stringify(recentOrders))
//       }
//     };
//   } catch (error) {
//     console.error('Error getting order statistics:', error);
//     return { success: false, error: error.message };
//   }
// }

export async function getOrderStatistics() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await connectToDatabase();
    await User.findOne(); // Ensure model is registered

    // 📊 Count all order statuses in one efficient query
    const statusAggregation = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    statusAggregation.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    // 💰 Get total revenue from delivered orders
    const revenueAggregation = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = revenueAggregation[0]?.total || 0;

    // 📦 Get recent orders (same as before)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate({
        path: 'items.product',
        select: 'name nameAr'
      });

    return {
      success: true,
      statistics: {
        pendingCount: statusCounts.pending,
        processingCount: statusCounts.processing,
        shippedCount: statusCounts.shipped,
        deliveredCount: statusCounts.delivered,
        cancelledCount: statusCounts.cancelled,
        totalRevenue,
        recentOrders: JSON.parse(JSON.stringify(recentOrders))
      }
    };
  } catch (error) {
    console.error('Error getting order statistics:', error);
    return { success: false, error: error.message };
  }
}