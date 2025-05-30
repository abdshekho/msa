import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

async function getChildCategoryBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?slug=${slug}&notNull=true`, {
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


export default async function CategoryDetailPage(props: { params: Promise<{ lang: Locale, slug: string }> }) {
    const { lang, mainCategory } = await props.params;
    const dictionary = await getDictionary(lang);
    const categoryAfter = await getChildCategoryBySlug(mainCategory);
    const category = categoryAfter[0];






    if (!category) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">{ dictionary.common?.notFound || 'Category not found' }</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href={ `/${lang}/categories` } className="text-blue-600 dark:text-blue-400 hover:underline">
                    { lang === 'en' ? "← Back to categories" : "→ الرجوع لتصنيفات المنتجات" }
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
                    <h1 className="text:lg text-3xl text-primary font-bold mb-4 text-center">{ lang === 'en' ? category.name : category.nameAr }</h1>
                    { category.description && (
                        <p className="text-gray-700 dark:text-gray-400 font-bold mb-4 leading-8">{ lang === 'en' ? category.description : category.descriptionAr }</p>
                    ) }
                </div>
            </div>

            {/* <h2 className="text-2xl font-bold mb-6 text-secondary dark:text-secondary-10">{ dictionary.products?.inThisCategory || 'Products in this category' }</h2> */ }
            <div className="mt-4">
                <h3 className="head-21 my-2 sm:my-4">{ dictionary.categories?.subcategories || 'Subcategories' }</h3>
                <ul className="space-y-2">
                    { category?.subcategories && category?.subcategories[0]?.name ? category.subcategories.map((subcategory: any) => (
                        <li key={ subcategory._id } className='bg-card-10 dark:bg-card p-4'>
                            <Link
                                href={ `/${lang}/categories/${category.slug}/${subcategory.slug}` }
                                className="text-blue-600 dark:text-blue-400  flex justify-between items-center"
                            >
                                <div className='flex hover:underline '>
                                    <div className="relative w-8 h-8 mr-2">
                                        { subcategory.image && (
                                            <Image
                                                src={ subcategory.image }
                                                alt={ subcategory.name }
                                                fill
                                                className="object-cover rounded-full"
                                            />
                                        ) }
                                    </div>
                                    { lang == 'en' ? subcategory.name : subcategory.nameAr }
                                </div>
                                {/* <span className="text-sm md:text-base">{ subcategory.name }</span> */ }
                                { subcategory.productCount !== undefined && (
                                    <span className="px-3 py-2 text-secondary dark:text-white bg-white font-bold dark:bg-gray-700 rounded-full text-xs hover:underline">
                                        { subcategory.productCount } { subcategory.productCount === 1 ? 'product' : 'products' }
                                    </span>
                                ) }
                            </Link>
                        </li>
                    )) : <div>This category not acitvated yet</div> }
                </ul>
            </div>
        </div>
    );
}