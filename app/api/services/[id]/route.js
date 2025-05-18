import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/DB/mongoDB';
import Service from '../../../lib/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Helper function to delete image file
async function deleteImageFile( imageUrl ) {
    try {
        if ( !imageUrl ) return;

        // Extract the file path from the URL
        // The URL format is like: /en/uploads/brands/filename.webp
        const relativePath = imageUrl.startsWith( '/' ) ? imageUrl.substring( 1 ) : imageUrl;
        const absolutePath = path.join( process.cwd(), 'public', relativePath );

        // Check if file exists before attempting to delete
        if ( fs.existsSync( absolutePath ) ) {
            await fsPromises.unlink( absolutePath );
            console.log( `Deleted image file: ${absolutePath}` );
        }
    } catch ( error ) {
        console.error( 'Error deleting image file:', error );
        // We don't throw here to allow the brand deletion to continue
    }
}

// Get a single service by ID
export async function GET( req, { params } ) {
    try {
        const { id } = await params;

        await connectToDatabase();
        const service = await Service.findById( id );

        if ( !service ) {
            return NextResponse.json( { error: 'Service not found' }, { status: 404 } );
        }

        return NextResponse.json( service );
    } catch ( err ) {
        console.error( 'Error fetching service:', err );
        return NextResponse.json( { error: 'Failed to fetch service' }, { status: 500 } );
    }
}

// Update a service
export async function PUT( req, { params } ) {
    try {
        // Check authentication and admin status
        const session = await getServerSession( authOptions );
        if ( !session || session.user.role !== 'admin' ) {
            return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
        }

        const { id } = await params;
        const { title, description, titleAr, descriptionAr, image, isActive, order } = await req.json();

        await connectToDatabase();

        const service = await Service.findById( id );



        if ( !service ) {
            return NextResponse.json( { error: 'Service not found' }, { status: 404 } );
        }
        const oldImage = service.image;

        // Update service fields
        if ( title ) service.title = title;
        if ( titleAr ) service.titleAr = title;
        if ( description ) service.description = description;
        if ( descriptionAr ) service.descriptionAr = descriptionAr;
        if ( image !== undefined ) service.image = image;
        if ( isActive !== undefined ) service.isActive = isActive;
        if ( order !== undefined ) service.order = order;

        await service.save();
        if ( oldImage && image && oldImage !== image ) {
            await deleteImageFile( oldImage );
        }
        return NextResponse.json( { message: 'Service updated successfully', service } );
    } catch ( err ) {
        console.error( 'Error updating service:', err );
        return NextResponse.json( { error: 'Failed to update service' }, { status: 500 } );
    }
}

// Delete a service
export async function DELETE( req, { params } ) {
    try {
        // Check authentication and admin status
        const session = await getServerSession( authOptions );
        if ( !session || session.user.role !== 'admin' ) {
            return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
        }

        const { id } = await params;

        await connectToDatabase();

        const service = await Service.findByIdAndDelete( id );
        if ( !service ) {
            return NextResponse.json( { error: 'Service not found' }, { status: 404 } );
        }

        if ( service.image ) {
            await deleteImageFile( service.image );
        }
        return NextResponse.json( { message: 'Service deleted successfully' } );
    } catch ( err ) {
        console.error( 'Error deleting service:', err );
        return NextResponse.json( { error: 'Failed to delete service' }, { status: 500 } );
    }
}