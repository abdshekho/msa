import React from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';
import mongoose from 'mongoose';
import Image from 'next/image';
import ProductTable2 from '@/components/products/ProductTabel2';

// Define a type for the product
interface ProductType {
    _id: string;
    name: string;
    price?: number;
    imageCover?: string;
    // Add other properties as needed
}

// Check if ID is valid
function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// This is a server component that fetches data on the server
async function ProductPage(
    { params }: { params: { id: string; lang: string } }
) {

    const { id, lang } = await params;
    console.log('🚀 ~ page.tsx ~ params:', id);
    console.log('🚀 ~ page.tsx ~ params:', lang);

    // const id = '681cee76e40bfca73da48419';


    // Validate the ID
    if (!isValidObjectId(id)) {
        notFound();
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch the product
    const product = await Product.findById(id).lean() as any;

    console.log('🚀 ~ page.tsx ~ product:', product);

    
    // If product not found, show 404
    if (!product) {
        notFound();
    }

    return (
        <div className="product-detail-container">
            <h1>prodcut name{ product.name }</h1>

            { product.imageCover && (
                <div className="product-image">
                    <Image width={300} height={300} src={ `${product.imageCover}` } alt={ product.name } />
                </div>
            ) }

            <div className="product-info">
                { product.price && (
                    <p className="product-price">${ product.price.toFixed(2) }</p>
                ) }

                { product.description && (
                    <div className="product-description">
                        <h2>Description</h2>
                        <p>{ product.description }</p>
                    </div>
                ) }

                {/* Add more product details as needed */ }
            </div>
            <ProductTable2 tableDataProps={product.table}/>
        </div>
    );
}
export default ProductPage;