import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Read the file as array buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;

        // Define path to save the file (in public directory)
        const uploadDir = path.join(process.cwd(), 'public/en/uploads');
        const filePath = path.join(uploadDir, fileName);

        // Save the file
        await writeFile(filePath, buffer);

        // Return the URL to access the file
        const imageUrl = `/en/uploads/${fileName}`;

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}