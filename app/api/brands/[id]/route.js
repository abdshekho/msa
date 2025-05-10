import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Brand from '@/app/lib/models/Brand';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Helper function to validate MongoDB ObjectId
function isValidObjectId( id ) {
    return mongoose.Types.ObjectId.isValid( id );
}

// Helper function to delete image file
async function deleteImageFile(imageUrl) {
    try {
        if (!imageUrl) return;
        
        // Extract the file path from the URL
        // The URL format is like: /en/uploads/brands/filename.webp
        const relativePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        const absolutePath = path.join(process.cwd(), 'public', relativePath);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(absolutePath)) {
            await fsPromises.unlink(absolutePath);
            console.log(`Deleted image file: ${absolutePath}`);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
        // We don't throw here to allow the brand deletion to continue
    }
}

// Get a single Brand
export async function GET( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid Brand ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const brand = await Brand.findById( id );

        if ( !brand ) {
            return NextResponse.json(
                { error: 'Brand not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( brand );
    } catch ( error ) {
        console.error( 'Error fetching Brand:', error );
        return NextResponse.json(
            { error: 'Failed to fetch Brand' },
            { status: 500 }
        );
    }
}

// Update a Brand
export async function PUT( request, { params } ) {
    try {
        const { id } = await params;
        const updateData = await request.json();

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid Brand ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if slug is being updated and if it already exists
        if ( updateData.slug ) {
            const existingBrand = await Brand.findOne( {
                slug: updateData.slug,
                _id: { $ne: id }
            } );

            if ( existingBrand ) {
                return NextResponse.json(
                    { error: 'A Brand with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        // If image is being updated, we might want to delete the old image
        // But we need to be careful not to delete if it's just an update without changing the image
        if (updateData.image && updateData.image !== updateData._oldImage) {
            const oldBrand = await Brand.findById(id);
            if (oldBrand && oldBrand.image && oldBrand.image !== updateData.image) {
                await deleteImageFile(oldBrand.image);
            }
        }

        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if ( !updatedBrand ) {
            return NextResponse.json(
                { error: 'Brand not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( updatedBrand );
    } catch ( error ) {
        console.error( 'Error updating Brand:', error );
        return NextResponse.json(
            { error: 'Failed to update Brand', details: error.message },
            { status: 500 }
        );
    }
}

// Delete a Brand
export async function DELETE( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid Brand ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // First, get the brand to access its image URL
        const brandToDelete = await Brand.findById(id);
        
        if (!brandToDelete) {
            return NextResponse.json(
                { error: 'Brand not found' },
                { status: 404 }
            );
        }

        // Delete the associated image file if it exists
        if (brandToDelete.image) {
            await deleteImageFile(brandToDelete.image);
        }

        // Now delete the brand from the database
        const deletedBrand = await Brand.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Brand:', error);
        return NextResponse.json(
            { error: 'Failed to delete Brand' },
            { status: 500 }
        );
    }
}