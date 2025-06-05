import Cart from '../models/Cart';
import connectToDatabase from '../DB/mongoDB';

/**
 * Get statistics about carts for admin dashboard
 * @returns Object containing cart statistics
 */
export async function getCartsStats() {
  await connectToDatabase();
  
  // Get total number of carts
  const totalCarts = await Cart.countDocuments();
  
  // Get active carts (created in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeCarts = await Cart.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  
  // Get average cart value
  const cartValues = await Cart.aggregate([
    { $group: { _id: null, avgValue: { $avg: "$totalPrice" } } }
  ]);
  const avgCartValue = cartValues.length > 0 ? cartValues[0].avgValue : 0;
  
  // Get total cart value
  const totalValue = await Cart.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalCartValue = totalValue.length > 0 ? totalValue[0].total : 0;
  
  return {
    totalCarts,
    activeCarts,
    avgCartValue: Math.round(avgCartValue * 100) / 100, // Round to 2 decimal places
    totalCartValue: Math.round(totalCartValue * 100) / 100
  };
}