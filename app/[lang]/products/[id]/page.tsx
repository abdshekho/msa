//@ts-nocheck
import React from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Product from '@/app/lib/models/Product';
import Category from '@/app/lib/models/Category';
import Brand from '@/app/lib/models/Brand';
import mongoose from 'mongoose';
import ProductTable2 from '@/components/products/ProductTabel2';
import AddToCartButton from '@/components/products/AddToCartButton';
import Link from 'next/link';
import ProductImages from '@/components/products/ProductImages';

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
    let category = null;
    let ParentCategory = null;
    let brand = null;

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
            <nav className="flex flex-wrap mb-8 text-xs md:text-sm text-gray-500">
                <Link href={`/${lang}`} className="hover:text-blue-600 dark:hover:text-secondary">{isArabic ? 'الرئيسية' : 'Home'}</Link>
                <span className="mx-2">/</span>
                <Link href={`/${lang}/products`} className="hover:text-blue-600 dark:hover:text-secondary">{isArabic ? 'المنتجات' : 'Products'}</Link>
                {ParentCategory && (
                    <>
                        <span className="mx-2">/</span>
                        <Link href={`/${lang}/categories/${ParentCategory.slug}`} className="hover:text-blue-600 dark:hover:text-secondary">
                            {ParentCategoryName}
                        </Link>
                    </>
                )}
                {category && (
                    <>
                        <span className="mx-2">/</span>
                        <Link href={`/${lang}/categories/${ParentCategory.slug}/${category.slug}`} className="hover:text-blue-600 dark:hover:text-secondary">
                            {categoryName}
                        </Link>
                    </>
                )}
                <span className="mx-2">/</span>
                <span className="text-primary font-medium">{productName}</span>
            </nav>

            {/* Product Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Images */}
                <ProductImages 
                    product={{
                        imageCover: product.imageCover,
                        images: product.images || []
                    }} 
                    productName={productName} />

                {/* Product Info */}
                <div className="md:w-1/2">
                    <div className='flex justify-center items-center'>
                        <h1 className="head-1 mb-4">{productName}</h1>
                    </div>
                    {/* Description */}
                    <div className="prose max-w-none mb-8">
                        <h3 className="head-22 mb-2">
                            {isArabic ? 'الوصف' : 'Description'}
                        </h3>
                        <p className="desc">{productDesc}</p>
                    </div>

                    {/* Features */}
                    {productFeatures && productFeatures.length > 0 && (
                        <div className="mb-8">
                            <h3 className="head-22 mb-2">
                                {isArabic ? 'المميزات' : 'Features'}
                            </h3>
                            <ul className="list-disc pl-5 space-y-1 desc">
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
                                <span className="head-22 mx-1">
                                    {isArabic ? 'الفئة:' : 'Category:'}
                                </span>
                                <Link href={`/${lang}/categories/${ParentCategory.slug}/${category.slug}`} className="hover:text-blue-600 dark:hover:text-secondary hover:underline">
                                    {categoryName}
                                </Link>
                            </div>
                        )}

                        {brandName && (
                            <div>
                                <span className="head-22 mx-1">
                                    {isArabic ? 'العلامة التجارية:' : 'Brand:'}
                                </span>
                                <Link href={`/${lang}/brands/${brandName}`} className="hover:text-blue-600 dark:hover:text-secondary hover:underline">
                                    {brandName}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className='flex justify-between items-center'>
                        <AddToCartButton productId={product._id.toString()} lang={lang} />
                        {product.price && (
                            <div className="head-1">
                                ${product.price.toFixed(2)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Technical Specifications Table */}
            {
                product.table && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {isArabic ? 'المواصفات الفنية' : 'Technical Specifications'}
                        </h2>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <ProductTable2 tableDataProps={JSON.parse(JSON.stringify(product.table))} />
                        </div>
                    </div>
                )
            }

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