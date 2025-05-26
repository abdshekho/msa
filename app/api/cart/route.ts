import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Cart from '@/app/lib/models/Cart';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ items: [], totalPrice: 0 });
    }
    
    await connectToDatabase();
    
    const userId = session.user.id.toString();
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name nameAr price imageCover'
      });
    
    if (!cart) {
      return NextResponse.json({ items: [], totalPrice: 0 });
    }
    
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}