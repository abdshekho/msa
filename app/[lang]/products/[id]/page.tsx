//@ts-nocheck
import React from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';
import Category from '@/app/lib/models/Category';
import Brand from '@/app/lib/models/Brand';
import mongoose from 'mongoose';
import Image from 'next/image';
import ProductTable2 from '@/components/products/ProductTabel2';

// Define types for the product and related data

interface ProductType {
    _id: string;
    name: string;
    nameAr: string;
    price: number;
    imageCover: string;
    images: string[];
    category: string;
    brand?: string;
    desc: string;
    descAr: string;
    features: string[];
    featuresAr: string[];
    table: any;
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

    // Validate the ID
    if (!isValidObjectId(id)) {
        notFound();
    }

    // Connect to the database
    await connectToDatabase();

    // Fetch the product
    const product = await Product.findById(id).lean();

    // If product not found, show 404
    if (!product) {
        notFound();
    }

    // Fetch category and brand data if they exist
    let category= null;
    let ParentCategory = null;
    let brand= null;

    if (product.category && isValidObjectId(product.category)) {
        category = await Category.findById(product.category).lean();
        ParentCategory = await Category.findById(category?.parentId).lean();
    }

    if (product.brand && isValidObjectId(product.brand)) {
        brand = await Brand.findById(product.brand).lean();
    }

    // Determine which language to display
    const isArabic = lang === 'ar';
    const productName = isArabic ? product.nameAr : product.name;
    const productDesc = isArabic ? product.descAr : product.desc;
    const productFeatures = isArabic ? product.featuresAr : product.features;
    
    // Get category and brand names based on language
    const categoryName = category 
        ? (isArabic && category.nameAr ? category.nameAr : category.name)
        : product.category;
        
    const ParentCategoryName = ParentCategory 
        ? (isArabic && ParentCategory.nameAr ? ParentCategory.nameAr : ParentCategory.name)
        : '';
        
    const brandName = brand
        ? (isArabic && brand.nameAr ? brand.nameAr : brand.name)
        : product.brand;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm text-gray-500">
                <a href={`/${lang}`} className="hover:text-blue-600">{isArabic ? 'الرئيسية' : 'Home'}</a>
                <span className="mx-2">/</span>
                <a href={`/${lang}/products`} className="hover:text-blue-600">{isArabic ? 'المنتجات' : 'Products'}</a>
                {ParentCategory && (
                    <>
                        <span className="mx-2">/</span>
                        <a href={`/${lang}/categories/${ParentCategory.slug}`} className="hover:text-blue-600">
                            {ParentCategoryName}
                        </a>
                    </>
                )}
                {category && (
                    <>
                        <span className="mx-2">/</span>
                        <a href={`/${lang}/categories/${category.slug}`} className="hover:text-blue-600">
                            {categoryName}
                        </a>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{productName}</span>
            </nav>

            {/* Product Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="relative h-96 w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        {product.imageCover && (
                            <Image
                                src={product.imageCover}
                                alt={productName}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((image, index) => (
                                image && (
                                    <div key={index} className="relative h-20 bg-gray-100 rounded-md overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`${productName} - image ${index + 1}`}
                                            fill
                                            className="object-cover hover:opacity-80 cursor-pointer"
                                            sizes="(max-width: 768px) 20vw, 10vw"
                                        />
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{productName}</h1>

                    {product.price && (
                        <div className="text-2xl font-semibold text-blue-600 mb-6">
                            ${product.price.toFixed(2)}
                        </div>
                    )}

                    {/* Description */}
                    <div className="prose max-w-none mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {isArabic ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="text-gray-700">{productDesc}</p>
                    </div>

                    {/* Features */}
                    {productFeatures && productFeatures.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {isArabic ? 'المميزات' : 'Features'}
                            </h3>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {productFeatures.map((feature, index) => (
                                    feature && <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-8">
                        {categoryName && (
                            <div>
                                <span className="font-medium text-gray-900">
                                    {isArabic ? 'الفئة:' : 'Category:'}
                                </span>
                                <span className="ml-2 text-gray-700">{categoryName}</span>
                            </div>
                        )}

                        {brandName && (
                            <div>
                                <span className="font-medium text-gray-900">
                                    {isArabic ? 'العلامة التجارية:' : 'Brand:'}
                                </span>
                                <span className="ml-2 text-gray-700">{brandName}</span>
                            </div>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex space-x-4">
                        <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                            {isArabic ? 'اطلب الآن' : 'Order Now'}
                        </button>
                        <button className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">
                            {isArabic ? 'تواصل معنا' : 'Contact Us'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Technical Specifications Table */}
            {product.table && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isArabic ? 'المواصفات الفنية' : 'Technical Specifications'}
                    </h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <ProductTable2 tableDataProps={product.table} />
                    </div>
                </div>
            )}

            {/* Related Products Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isArabic ? 'منتجات ذات صلة' : 'Related Products'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Placeholder for related products */}
                    <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center text-gray-400">
                        {isArabic ? 'منتجات ذات صلة ستظهر هنا' : 'Related products will appear here'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;