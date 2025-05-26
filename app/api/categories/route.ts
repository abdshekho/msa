import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Category from '@/app/lib/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    
    let query = Category.find();
    
    // Apply limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const categories = await query.exec();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}