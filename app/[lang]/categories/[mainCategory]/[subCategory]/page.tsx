import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

async function getCategoryBySlug(subCategory: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?slug=${subCategory}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch category');
        }

        const categories = await res.json();
        return categories; // Return the first category that matches the slug
    } catch (error) {
        console.error('Error loading category:', error);
        return null;
    }
}

async function getProductsByCategory(categoryId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?category=${categoryId}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        return res.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

export default async function CategoryDetailPage(props: { params: Promise<{ lang: Locale,mainCategory: string, subCategory: string }> }) {
    const { lang,  mainCategory, subCategory } = await props.params;
    const resolve = await props.params;
    const dictionary = await getDictionary(lang);
    const category = await getCategoryBySlug(subCategory);




    if (!category) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">{ dictionary.common?.notFound || 'Category not found' }</h1>
            </div>
        );
    }
    const products = await getProductsByCategory(category._id);


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href={ `/${lang}/categories` } className="hover:text-secondary hover:underline">
                    ← { dictionary.common?.backToCategories || 'Back to Categories' }
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
                { category.image && (
                    <div className="md:w-1/3">
                        <div className="relative h-64 w-full">
                            <Image
                                src={ category.image }
                                alt={ category.name }
                                fill
                                className="rounded-lg object-contain"
                            />
                        </div>
                    </div>
                ) }

                <div className="md:w-2/3">
                    <h1 className="text:lg text-3xl text-primary font-bold mb-4 ">{ category.name }</h1>
                    { category.description && (
                        <p className="text-gray-700 dark:text-gray-400 font-bold mb-4">{ category.description }</p>
                    ) }
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-secondary dark:text-secondary-10">{ dictionary.products?.inThisCategory || 'Products in this category' }</h2>

            { products?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    { products.map((product: any) => (
                        <div key={ product._id } className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden py-2 sm:py-4">
                            <div className="relative h-48">
                                <Image
                                    src={ product.imageCover }
                                    alt={ product.name }
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg text-primary font-semibold mb-2">{ product.name }</h3>
                                <p className="text-secondary dark:text-secondary-10 font-bold mb-2">${ product.price.toFixed(2) }</p>
                                <Link
                                    href={ `/${lang}/products/${product._id}` }
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full text-center"
                                >
                                    { dictionary.common?.viewDetails || 'View Details' }
                                </Link>
                            </div>
                        </div>
                    )) }
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400">
                    { dictionary.products?.noProductsInCategory || 'No products found in this category.' }
                </p>
            ) }
        </div>
    );
}