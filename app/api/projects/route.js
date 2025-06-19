import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/DB/mongoDB';
import Project from '../../lib/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Get all Projects
export async function GET() {
    try {
        await connectToDatabase();
        const Projects = await Project.find( {} ).sort( { order: 1 } );

        return NextResponse.json( Projects );
    } catch ( err ) {
        console.error( 'Error fetching Projects:', err );
        return NextResponse.json( { error: 'Failed to fetch Projects' }, { status: 500 } );
    }
}

// Create a new Project
export async function POST( req ) {
    try {
        // Check authentication and admin status
        const session = await getServerSession( authOptions );
        if ( !session || session.user.role !== 'admin' ) {
            return NextResponse.json( { error: 'Unauthorized' }, { status: 401 } );
        }

        const { title, titleAr, description, descriptionAr, slug, image, isActive, order } = await req.json();

        if ( !title  || !titleAr || !description || !descriptionAr) {
            return NextResponse.json( { error: 'Title, description, and image are required' }, { status: 400 } );
        }

        // Generate slug if not provided
        if ( !slug ) {
            slug = title
                .toLowerCase()
                .replace( /[^a-z0-9]+/g, '-' )
                .replace( /(^-|-$)/g, '' );
        }

        await connectToDatabase();

        const project = await Project.create( {
            title,
            titleAr,
            description,
            descriptionAr,
            slug,
            image,
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0
        } );

        return NextResponse.json( { message: 'Project created successfully', project } );
    } catch ( err ) {
        console.error( 'Error creating Project:', err );
        return NextResponse.json( { error: 'Failed to create Project' }, { status: 500 } );
    }
}