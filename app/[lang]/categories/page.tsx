import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import Image from 'next/image';
import CategoriesHero from '@/components/categories/CategoriesHero';

async function getCategories() {
  try {
    // Use nested=true to get a hierarchical structure of categories
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?nested=true`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return res.json();
  } catch (error) {
    console.error('Error loading categories:', error);
    return [];
  }
}

export default async function CategoriesPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  const categories = await getCategories();

  return (
    <div className="mx-auto">
      <CategoriesHero />
      <div className='container mx-auto px-4 py-16'>
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{ dictionary.categories?.allCategories || 'All Categories' }</h1>
        <p className="text-sm md:text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          We offer a wide range of solar power services to meet your energy needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          { categories.map((category: any) => (
            <div key={ category.id } className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg md:text-2xl text-primary dark:text-primary font-bold mb-4">{ category.name }</h2>

                { category.image && (
                  <div className="relative h-40 mb-4">
                    <Image
                      src={ category.image }
                      alt={ category.name }
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                ) }

                <div className="mt-4">
                  <h3 className="text-md md:text-xl font-medium mb-2 text-secondary-10">{ dictionary.categories?.subcategories || 'Subcategories' }</h3>
                  <ul className="space-y-2">
                    { category.items && category.items.map((subcategory: any) => (
                      <li key={ subcategory.id }>
                        <Link
                          href={ `/${lang}/categories/${subcategory.slug}` }
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                        >
                          { subcategory.image && (
                            <div className="relative w-8 h-8 mr-2">
                              <Image
                                src={ subcategory.image }
                                alt={ subcategory.name }
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                          ) }
                          { subcategory.name }
                        </Link>
                      </li>
                    )) }
                  </ul>
                </div>

                <Link
                  href={ `/${lang}/categories/${category.slug}` }
                  className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-10 transition"
                >
                  { dictionary.common?.viewAll || 'View All' }
                </Link>
              </div>
            </div>
          )) }
        </div>
      </div>
    </div>
  );
}