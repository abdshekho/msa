import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    const category = url.searchParams.get('category');
    const brand = url.searchParams.get('brand');
    
    // Build query based on parameters
    const queryParams: any = {};
    
    if (category) {
      queryParams.category = category;
    }
    
    if (brand) {
      queryParams.brand = brand;
    }
    
    let query = Product.find(queryParams);
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const products = await query.exec();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}