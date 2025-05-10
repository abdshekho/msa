import { NextResponse } from 'next/server';
// import connectToDatabase from '../../lib/db/mongoDB';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';


// Get all products
export async function GET( request ) {
    try {
        const { searchParams } = new URL( request.url );
        const category = searchParams.get( 'category' );
        // const subcategory = searchParams.get( 'subcategory' );

        const query = {};
        if ( category ) query.category = category;
        // if ( subcategory ) query.subcategory = subcategory;

        await connectToDatabase();
        const products = await Product.find( query ).sort( { createdAt: -1 } );

        return NextResponse.json( products );
    } catch ( error ) {
        console.error( 'Error fetching products:', error );
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// Create a new product
export async function POST( request ) {
    try {
        const productData = await request.json();

        // Validate required fields
        const requiredFields = [ 'name', 'nameAr', 'price', 'imageCover', 'category', 'desc', 'descAr' ];
        for ( const field of requiredFields ) {
            if ( !productData[ field ] ) {
                return NextResponse.json(
                    { error: `Field '${field}' is required` },
                    { status: 400 }
                );
            }
        }

        await connectToDatabase();
        const product = await Product.create( productData );

        return NextResponse.json( {
            message: 'Product created successfully',
            product
        }, { status: 201 } );
    } catch ( error ) {
        console.error( 'Error creating product:', error );
        return NextResponse.json(
            { error: 'Failed to create product', details: error.message },
            { status: 500 }
        );
    }
}

// export async function GET( request, { params } ) {
//     try {
//         const { id } = params;

//         if ( !isValidObjectId( id ) ) {
//             return NextResponse.json(
//                 { error: 'Invalid product ID' },
//                 { status: 400 }
//             );
//         }

//         await connectToDatabase();
//         const product = await Product.findById( id );

//         if ( !product ) {
//             return NextResponse.json(
//                 { error: 'Product not found' },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json( product );
//     } catch ( error ) {
//         console.error( 'Error fetching product:', error );
//         return NextResponse.json(
//             { error: 'Failed to fetch product' },
//             { status: 500 }
//         );
//     }
// }

// Update a product
export async function PUT( request, { params } ) {
    try {
        const { id } = await params;
        const updateData = await request.json();

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if ( !updatedProduct ) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( {
            message: 'Product updated successfully',
            product: updatedProduct
        } );
    } catch ( error ) {
        console.error( 'Error updating product:', error );
        return NextResponse.json(
            { error: 'Failed to update product', details: error.message },
            { status: 500 }
        );
    }
}

// Delete a product
export async function DELETE( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const deletedProduct = await Product.findByIdAndDelete( id );

        if ( !deletedProduct ) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( {
            message: 'Product deleted successfully'
        } );
    } catch ( error ) {
        console.error( 'Error deleting product:', error );
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
