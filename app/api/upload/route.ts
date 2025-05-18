import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
        try {
            const formData = await request.formData();
            const file = formData.get('image') as File;
            // Get the content type (product, category, brand)
            const contentType = formData.get('type') as string || 'product'; // Default to product

            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            // Read the file as array buffer
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename (without extension since we'll use .webp)
            const fileNameWithoutExt = `${uuidv4()}-${path.parse(file.name.replace(/\s/g, '_')).name}`;
            const webpFileName = `${fileNameWithoutExt}.webp`;

            // Determine the appropriate subfolder based on content type
            let subfolder = 'products'; // Default
            if (contentType === 'category') {
                subfolder = 'categories';
            } else if (contentType === 'brand') {
                subfolder = 'brands';
            } else if (contentType === 'porfiles') {
                subfolder = 'porfiles';
            }else if (contentType === 'services') {
                subfolder = 'services';
            }

            // Define path to save the file (in public directory with appropriate subfolder)
            const uploadDir = path.join(process.cwd(), `public/en/uploads/${subfolder}`);
        
            // Ensure upload directory exists
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }
        
            const filePath = path.join(uploadDir, webpFileName);

            // Convert image to WebP format
            await sharp(buffer)
                .webp({ 
                    quality: 80,       // 0-100, higher is better quality but larger file
                    lossless: false,   // true for lossless compression
                    nearLossless: false, // true for near-lossless compression
                    alphaQuality: 100, // 0-100, quality of alpha channel
                  }) // You can adjust quality as needed
                .toFile(filePath);

            // Return the URL to access the file
            const imageUrl = `/en/uploads/${subfolder}/${webpFileName}`;

            return NextResponse.json({ imageUrl });
        } catch (error) {
            console.error('Error uploading file:', error);
            return NextResponse.json({ 
                error: 'Upload failed', 
                details: error instanceof Error ? error.message : 'Unknown error' 
            }, { status: 500 });
        }
}