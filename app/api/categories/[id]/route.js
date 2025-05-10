import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Category from '@/app/lib/models/Category';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
// Helper function to validate MongoDB ObjectId
function isValidObjectId( id ) {
    return mongoose.Types.ObjectId.isValid( id );
}

// Helper function to delete image file
async function deleteImageFile( imageUrl ) {
    try {
        if ( !imageUrl ) return;

        // Extract the file path from the URL
        // The URL format is like: /en/uploads/Categorys/filename.webp
        const relativePath = imageUrl.startsWith( '/' ) ? imageUrl.substring( 1 ) : imageUrl;
        const absolutePath = path.join( process.cwd(), 'public', relativePath );

        // Check if file exists before attempting to delete
        if ( fs.existsSync( absolutePath ) ) {
            await fsPromises.unlink( absolutePath );
            console.log( `Deleted image file: ${absolutePath}` );
        }
    } catch ( error ) {
        console.error( 'Error deleting image file:', error );
        // We don't throw here to allow the Category deletion to continue
    }
}

// Get a single category
export async function GET( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const category = await Category.findById( id ).populate( 'subcategories' );

        if ( !category ) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( category );
    } catch ( error ) {
        console.error( 'Error fetching category:', error );
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

// Update a category
export async function PUT( request, { params } ) {
    try {
        const { id } = await params;
        const updateData = await request.json();

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if slug is being updated and if it already exists
        if ( updateData.slug ) {
            const existingCategory = await Category.findOne( {
                slug: updateData.slug,
                _id: { $ne: id }
            } );
            // Convertir parentId to a null
            if ( updateData.parentId === "" ) {
                updateData.parentId = null;
            }
            if ( existingCategory ) {
                return NextResponse.json(
                    { error: 'A category with this slug already exists' },
                    { status: 409 }
                );
            }
        }

        // If image is being updated, we might want to delete the old image
        // But we need to be careful not to delete if it's just an update without changing the image
        if ( updateData.image && updateData.image !== updateData._oldImage ) {
            const oldCategory = await Category.findById( id );
            if ( oldCategory && oldCategory.image && oldCategory.image !== updateData.image ) {
                await deleteImageFile( oldCategory.image );
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate( 'subcategories' );

        if ( !updatedCategory ) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( updatedCategory );
    } catch ( error ) {
        console.error( 'Error updating category:', error );
        return NextResponse.json(
            { error: 'Failed to update category', details: error.message },
            { status: 500 }
        );
    }
}

// Delete a category
export async function DELETE( request, { params } ) {
    try {
        const { id } = await params;

        if ( !isValidObjectId( id ) ) {
            return NextResponse.json(
                { error: 'Invalid category ID' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if category has subcategories
        const hasSubcategories = await Category.exists( { parentId: id } );
        if ( hasSubcategories ) {
            return NextResponse.json(
                { error: 'Cannot delete category with subcategories. Delete subcategories first or reassign them.' },
                { status: 400 }
            );
        }

        const brandToDelete = await Category.findById( id );

        if ( !brandToDelete ) {
            return NextResponse.json(
                { error: 'Brand not found' },
                { status: 404 }
            );
        }

        // Delete the associated image file if it exists
        if ( brandToDelete.image ) {
            await deleteImageFile( brandToDelete.image );
        }

        const deletedCategory = await Category.findByIdAndDelete( id );

        if ( !deletedCategory ) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json( {
            message: 'Category deleted successfully'
        } );
    } catch ( error ) {
        console.error( 'Error deleting category:', error );
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
