import Cart from '../models/Cart';
import connectToDatabase from '../DB/mongoDB';

/**
 * Get all carts with details for admin dashboard
 * @returns Array of carts with populated user and product details
 */
export async function getCartsForAdmin() {
  await connectToDatabase();

  // Get all carts with populated user and product details
  const carts = await Cart.find()
    .populate({
      path: 'user',
      select: 'name email image'
    })
    .populate({
      path: 'items.product',
      select: 'name nameAr imageCover price'
    })
    .sort({ createdAt: -1 }); // Sort by newest first

  console.log(carts);
  return JSON.parse(JSON.stringify(carts));
}

/**
 * Get a single cart by ID with full details
 * @param cartId The ID of the cart to retrieve
 * @returns Cart object with populated user and product details
 */
export async function getCartById(cartId: string) {
  await connectToDatabase();

  const cart = await Cart.findById(cartId)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'items.product',
      select: 'name nameAr imageCover price slug'
    });

  if (!cart) {
    throw new Error('Cart not found');
  }

  return JSON.parse(JSON.stringify(cart));
}