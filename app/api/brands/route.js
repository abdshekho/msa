import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Brand from '@/app/lib/models/Brand';
// import Product from '@/app/lib/models/Product';

// Get all brands
export async function GET( request ) {
    try {
        const { searchParams } = new URL( request.url );
        const includeProductCount = searchParams.get( 'includeProductCount' ) === 'true';
        const fields = searchParams.get( 'fields' );
        const projection = fields
            ? fields.split( ',' ).reduce( ( acc, f ) => ( { ...acc, [ f ]: 1 } ), {} )
            : {};
        await connectToDatabase();

        if ( includeProductCount ) {
            const brandsWithCounts = await Brand.aggregate( [
                {
                    $lookup: {
                        from: 'products', // اسم مجموعة المنتجات في قاعدة البيانات
                        localField: '_id',
                        foreignField: 'brand',
                        as: 'products',
                    },
                },
                {
                    $addFields: {
                        productCount: { $size: '$products' },
                    },
                },
                {
                    $project: {
                        products: 0, // نحذف قائمة المنتجات إذا ما بدنا نعرضها
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
            ] );

            return NextResponse.json( brandsWithCounts );
        }

        // في حال عدم طلب عدد المنتجات
        const brands = await Brand.find( {} ,projection).sort( { createdAt: -1 } );
        return NextResponse.json( brands );

    } catch ( err ) {
        console.error( 'Error fetching brands:', err );
        return NextResponse.json( { error: 'Failed to read brands' }, { status: 500 } );
    }
}


// Create a new Brand
export async function POST( request ) {
    try {
        const brandData = await request.json();

        // Validate required fields
        if ( !brandData.name || !brandData.nameAr ) {
            return NextResponse.json(
                { error: 'Name and Arabic name are required' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        if ( !brandData.slug ) {
            brandData.slug = brandData.name
                .toLowerCase()
                .replace( /[^a-z0-9]+/g, '-' )
                .replace( /(^-|-$)/g, '' );
        }

        await connectToDatabase();

        // Check if slug already exists
        const existingBrand = await Brand.findOne( { slug: brandData.slug } );
        if ( existingBrand ) {
            return NextResponse.json(
                { error: 'A Brand with this slug already exists' },
                { status: 409 }
            );
        }

        const newBrand = await Brand.create( brandData );

        return NextResponse.json( {
            message: 'Brand created successfully',
            newBrand
        }, { status: 201 } );
    } catch ( error ) {
        console.error( 'Error creating Brand:', error );
        return NextResponse.json(
            { error: 'Failed to create Brand', details: error.message },
            { status: 500 }
        );
    }
}