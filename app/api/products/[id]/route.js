import { NextResponse } from 'next/server';
// import connectToDatabase from '../../lib/db/mongoDB';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';
import mongoose from 'mongoose';

function isValidObjectId( id ) {
    return mongoose.Types.ObjectId.isValid( id );
}
// Helper function to delete image file
async function deleteImageFile(imageUrl) {
    try {
        if (!imageUrl) return;
        
        // Extract the file path from the URL
        // The URL format is like: /en/uploads/Products/filename.webp
        const relativePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        const absolutePath = path.join(process.cwd(), 'public', relativePath);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(absolutePath)) {
            await fsPromises.unlink(absolutePath);
            console.log(`Deleted image file: ${absolutePath}`);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
        // We don't throw here to allow the Product deletion to continue
    }
}

export async function GET( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const product = await Product.findById( id );

        if ( !product ) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( product );
    } catch ( error ) {
        console.error( 'Error fetching product:', error );
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}


// Update a Product
export async function PUT( request, { params } ) {
    try {
        const { id } = await params;
        const updateData = await request.json();

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid Product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if slug is being updated and if it already exists
        if ( updateData.slug ) {
            const existingProduct = await Product.findOne( {
                slug: updateData.slug,
                _id: { $ne: id }
            } );

            if ( existingProduct ) {
                return NextResponse.json(
                    { error: 'A Product with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        // If image is being updated, we might want to delete the old image
        // But we need to be careful not to delete if it's just an update without changing the image
        if (updateData.imageCover && updateData.imageCover !== updateData._oldImage) {
            const oldProduct = await Product.findById(id);
            if (oldProduct && oldProduct.imageCover && oldProduct.imageCover !== updateData.imageCover) {
                await deleteImageFile(oldProduct.imageCover);
            }
        }

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

        return NextResponse.json( updatedProduct );
    } catch ( error ) {
        console.error( 'Error updating Product:', error );
        return NextResponse.json(
            { error: 'Failed to update Product', details: error.message },
            { status: 500 }
        );
    }
}



// Delete a Product
export async function DELETE( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid Product ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // First, get the product to access its image URL
        const productToDelete = await Product.findById(id);
        
        if (!productToDelete) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Delete the associated image file if it exists
        if (productToDelete.imageCover) {
            await deleteImageFile(productToDelete.imageCover);
        }

        // Now delete the product from the database
        const deletedProduct = await Product.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Product:', error);
        return NextResponse.json(
            { error: 'Failed to delete Product' },
            { status: 500 }
        );
    }
}