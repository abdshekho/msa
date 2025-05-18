import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/DB/mongoDB';
import Service from '../../lib/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Get all services
export async function GET() {
    try {
        await connectToDatabase();
        const services = await Service.find( {} ).sort( { order: 1 } );

        return NextResponse.json( services );
    } catch ( err ) {
        console.error( 'Error fetching services:', err );
        return NextResponse.json( { error: 'Failed to fetch services' }, { status: 500 } );
    }
}

// Create a new service
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

        const service = await Service.create( {
            title,
            titleAr,
            description,
            descriptionAr,
            slug,
            image,
            isActive: isActive !== undefined ? isActive : true,
            order: order || 0
        } );

        return NextResponse.json( { message: 'Service created successfully', service } );
    } catch ( err ) {
        console.error( 'Error creating service:', err );
        return NextResponse.json( { error: 'Failed to create service' }, { status: 500 } );
    }
}