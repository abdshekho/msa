import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Order from '@/app/lib/models/Order';

// Import User model to ensure it's registered
import '@/app/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const formData = await req.formData();
    const orderId = formData.get('orderId') as string;
    const status = formData.get('status') as string;
    
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    order.status = status;
    await order.save();
    
    // Redirect back to the order detail page
    const url = new URL(req.url);
    const lang = url.pathname.split('/')[1]; // Extract language from URL
    
    return NextResponse.redirect(new URL(`/${lang}/dashboard/orders/${orderId}`, req.url));
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}