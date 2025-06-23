import { NextRequest, NextResponse } from 'next/server';
// import connectToDatabase from '../../lib/db/mongoDB';
import connectToDatabase from '@/app/lib/DB/mongoDB';
// import Product from '@/app/lib/models/Product';
import mongoose from 'mongoose';
import { Product } from '@/app/lib/models';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { filters } = body;

    if (!filters || typeof filters !== 'object') {
      return NextResponse.json({ message: 'Invalid or missing filters' }, { status: 400 });
    }
    

    // ابحث بالفلتر مباشرة (ممكن يكون $or أو أي فلتر آخر)
    const products = await Product.find(filters).lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('[ERROR] /api/products/system:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}