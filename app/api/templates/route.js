import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/DB/mongoDB';
import Template from '../../lib/models/Template';

export async function GET() {
    try {
        await connectToDatabase();
        const templates = await Template.find( {} ).sort( { createdAt: -1 } );

        return NextResponse.json( templates );
    } catch ( err ) {
        console.error( 'Error fetching templates:', err );
        return NextResponse.json( { error: 'Failed to read templates' }, { status: 500 } );
    }
}

export async function POST( req ) {
    try {
        const { name, rows, headers } = await req.json();
        console.log('🚀 ~ route.js ~ POST ~ name, rows, headers:', name, rows, headers);

        if ( !name ) {
            return NextResponse.json( { error: 'Template name is required' }, { status: 400 } );
        }

        await connectToDatabase();

        // Check if a template with this name already exists
        const existingTemplate = await Template.findOne( { name } );
        if ( existingTemplate ) {
            // Option 1: Return an error
            return NextResponse.json( { error: 'A template with this name already exists' }, { status: 409 } );
        }

        // Create a new template with all required fields
        const template = await Template.create( {
            name,
            headers,
            rows
        } );

        return NextResponse.json( { message: 'Template saved', template } );
    } catch ( err ) {
        console.error( 'Error saving template:', err );
        return NextResponse.json( { error: 'Failed to save template' }, { status: 500 } );
    }
}
