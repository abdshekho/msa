import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/DB/mongoDB';
import Project from '../../../lib/models/Project';
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

// Get a single project by ID
export async function GET( req, { params } ) {
    try {
        const { id } = await params;

        await connectToDatabase();
        const project = await Project.findById( id );

        if ( !project ) {
            return NextResponse.json( { error: 'Project not found' }, { status: 404 } );
        }

        return NextResponse.json( project );
    } catch ( err ) {
        console.error( 'Error fetching project:', err );
        return NextResponse.json( { error: 'Failed to fetch project' }, { status: 500 } );
    }
}

// Update a project
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

        const project = await Project.findById( id );



        if ( !project ) {
            return NextResponse.json( { error: 'Project not found' }, { status: 404 } );
        }
        const oldImage = project.image;

        // Update project fields
        if ( title ) project.title = title;
        if ( titleAr ) project.titleAr = title;
        if ( description ) project.description = description;
        if ( descriptionAr ) project.descriptionAr = descriptionAr;
        if ( image !== undefined ) project.image = image;
        if ( isActive !== undefined ) project.isActive = isActive;
        if ( order !== undefined ) project.order = order;

        await project.save();
        if ( oldImage && image && oldImage !== image ) {
            await deleteImageFile( oldImage );
        }
        return NextResponse.json( { message: 'Project updated successfully', project } );
    } catch ( err ) {
        console.error( 'Error updating project:', err );
        return NextResponse.json( { error: 'Failed to update project' }, { status: 500 } );
    }
}

// Delete a project
export async function DELETE( req, { params } ) {
    try {
        // Check authentication and admin status
        const session = await getServerSession( authOptions );
        if ( !session || session.user.role !== 'admin' ) {
            return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
        }

        const { id } = await params;

        await connectToDatabase();

        const project = await Project.findByIdAndDelete( id );
        if ( !project ) {
            return NextResponse.json( { error: 'Project not found' }, { status: 404 } );
        }

        if ( project.image ) {
            await deleteImageFile( project.image );
        }
        return NextResponse.json( { message: 'Project deleted successfully' } );
    } catch ( err ) {
        console.error( 'Error deleting project:', err );
        return NextResponse.json( { error: 'Failed to delete project' }, { status: 500 } );
    }
}