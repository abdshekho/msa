'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/context/CategoryContext';

interface Category {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  image?: string;
}

export default function CategorySection({ lang }: { lang: string }) {
  const { categories, loading } = useCategories();

  // console.log('🚀 ~ CategorySection.tsx ~ categories:', categories);

  const isArabic = lang === 'ar';

  // useEffect(() => {
  //   async function fetchCategories() {
  //     try {
  //       const response = await fetch('/api/categories?limit=6');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setCategories(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   const data = JSON.parse(localStorage.getItem('cachedCategories') || null)
  //   //1 hour 3600000
  //   //  if (data && data.cachedAt && Date.now() - data.cachedAt < 3600000) {
  //   if (data && data?.cachedAt) {
  //     console.log('get from cache')
  //     setCategories(data.data);
  //     setLoading(false);
  //   } else {
  //     console.log('get from bags')
  //     // fetchCategories();
  //   }
  //   // fetchCategories();
  // }, []);

  if (loading) {
    return (
      <div className="relative bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
            { isArabic ? 'تصفح حسب الفئة' : 'Browse by Category' }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { [1, 2, 3, 4].map((i) => (
              <div key={ i } className="bg-gray-200 dark:bg-gray-700 rounded-lg h-90 animate-pulse"></div>
            )) }
          </div>
        </div>
        {/* <div className="custom-shape-divider-bottom-1749046574">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" className="shape-fill"></path>
          </svg>
        </div> */}
      </div>
    );
  }

  return (
    <div className="relative bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
          { isArabic ? 'تصفح حسب الفئة' : 'Browse by Category' }
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          { categories.map((category: any) => (
            <div key={ category._id } className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <div className="p-6 h-full flex flex-col justify-between" style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className="text-lg md:text-2xl text-primary dark:text-primary font-bold">
                    { lang === 'en' ? category.name : (category.nameAr || category.name) }
                  </h2>
                  <span className="px-3 py-2 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium">
                    { category?.items.length } { lang === 'en'
                      ? (category?.items.length === 1 ? 'category' : 'categories')
                      : 'فئة' }
                  </span>
                </div>

                { category.image && (
                  <div className="relative h-40 mb-4">
                    <Image
                      src={ category.image }
                      alt={ lang === 'en' ? category.name : (category.nameAr || category.name) }
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                ) }

                <div className="mt-4">
                  <h3 className="text-md md:text-xl font-bold mb-2 text-secondary dark:text-secondary-10">
                    { lang === 'en' ? 'Subcategories' : 'الفئات الفرعية' }
                  </h3>
                  <ul className="space-y-2">
                    { category.items && category.items.map((subcategory: any) => (
                      <li key={ subcategory._id }>
                        <Link
                          href={ `/${lang}/categories/${category.slug}/${subcategory.slug}` }
                          className="text-gray-800  dark:text-gray-100 flex justify-between items-center"
                        >
                          <div className='flex hover:underline'>
                            <div className="relative w-8 h-8 mr-2">

                                <Image
                                  src={ subcategory.image || category.image }
                                  alt={ lang === 'en' ? subcategory.name : (subcategory.nameAr || subcategory.name) }
                                  fill
                                  className="object-cover rounded-full"
                                />
                            
                            </div>
                            { lang === 'en' ? subcategory.name : (subcategory.nameAr || subcategory.name) }
                          </div>
                          { subcategory.items.length !== undefined && (
                            <span className="px-3 py-2 text-black dark:text-white bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium">
                              { subcategory.items.length } { lang === 'en'
                                ? (subcategory.items.length === 1 ? 'product' : 'products')
                                : 'منتج' }
                            </span>
                          ) }
                        </Link>
                      </li>
                    )) }
                  </ul>
                </div>

                <Link
                  href={ `/${lang}/categories/${category.slug}` }
                  className="mt-6 inline-block px-4 py-2 bg-primary text-white text-center rounded-md hover:bg-primary-10 transition"
                >
                  { lang === 'en' ? 'View All' : 'عرض الكل' }
                </Link>
              </div>
            </div>
          )) }
        </div>

        <div className="text-center mt-8">
          <Link
            href={ `/${lang}/categories` }
            className="inline-block px-6 py-3 border border-primary text-primary font-medium rounded-md hover:border-primary-10 hover:text-primary-10  transition-colors"
          >
            { isArabic ? 'عرض جميع الفئات' : 'View All Categories' }
          </Link>
        </div>
      </div>
      {/* <div className="custom-shape-divider-bottom-1749046574">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" className="shape-fill"></path>
        </svg>
      </div> */}
    </div>
  );
}