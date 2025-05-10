import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Category from '@/app/lib/models/Category';
import Product from '@/app/lib/models/Product'; // Assuming you have a Product model

// Get all categories
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parentId');
        const notNull = searchParams.get('notNull');
        const fields = searchParams.get('fields');
        const withProducts = searchParams.get('withProducts') === 'true';
        const nested = searchParams.get('nested') === 'true';

        // If nested structure is requested, handle it differently
        if (nested) {
            await connectToDatabase();
            
            // First, get all parent categories (where parentId is null)
            const parentCategories = await Category.find({ parentId: null })
                .sort({ order: 1, name: 1 });
            
            // For each parent category, get its subcategories
            const result = await Promise.all(parentCategories.map(async (parentCategory) => {
                const subcategories = await Category.find({ parentId: parentCategory._id })
                    .sort({ order: 1, name: 1 });
                
                // If withProducts is true, get products for each subcategory
                if (withProducts) {
                    const subcategoriesWithProducts = await Promise.all(subcategories.map(async (subCategory) => {
                        const products = await Product.find({ category: subCategory._id })
                            .select('_id name slug imageCover price') // Select only needed fields
                            .sort({ createdAt: -1 });
                        
                        return {
                            id: subCategory._id,
                            name: subCategory.name,
                            slug: subCategory.slug,
                            image: subCategory.image,
                            items: products.map(product => ({
                                id: product._id,
                                name: product.name,
                                slug: product.slug,
                                imageCover: product.imageCover,
                                price: product.price
                            }))
                        };
                    }));
                    
                    return {
                        id: parentCategory._id,
                        name: parentCategory.name,
                        slug: parentCategory.slug,
                        imageCover: parentCategory.imageCover,
                        items: subcategoriesWithProducts
                    };
                } else {
                    // Return just the subcategories without products
                    return {
                        id: parentCategory._id,
                        name: parentCategory.name,
                        slug: parentCategory.slug,
                        image: parentCategory.image,
                        items: subcategories.map(subCategory => ({
                            id: subCategory._id,
                            name: subCategory.name,
                            slug: subCategory.slug,
                            image: subCategory.image
                        }))
                    };
                }
            }));
            
            return NextResponse.json(result);
        }
        
        // Handle regular category queries (existing functionality)
        const query = {};
        if (parentId === 'null') {
            query.parentId = null;
        } else if (parentId) {
            query.parentId = parentId;
        }
        
        // Add condition for notNull parameter
        if (notNull === 'true') {
            query.parentId = { $ne: null };
        }

        await connectToDatabase();
        
        let projection = {};
        // If fields parameter is provided, only return those fields
        if (fields) {
            const fieldList = fields.split(',');
            fieldList.forEach(field => {
                projection[field] = 1;
            });
        }

        const categories = await Category.find(query, projection)
            .sort({ order: 1, name: 1 })
            .populate('subcategories');

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// Create a new category
export async function POST(request) {
    try {
        const categoryData = await request.json();

        // Validate required fields
        if (!categoryData.name || !categoryData.nameAr) {
            return NextResponse.json(
                { error: 'Name and Arabic name are required' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        if (!categoryData.slug) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        // Convert empty parentId to null
        if (categoryData.parentId === "") {
            categoryData.parentId = null;
        }

        await connectToDatabase();

        // Check if slug already exists
        const existingCategory = await Category.findOne({ slug: categoryData.slug });
        if (existingCategory) {
            return NextResponse.json(
                { error: 'A category with this slug already exists' },
                { status: 409 }
            );
        }

        const category = await Category.create(categoryData);

        return NextResponse.json({
            message: 'Category created successfully',
            category
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category', details: error.message },
            { status: 500 }
        );
    }
}
