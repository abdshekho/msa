'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  image?: string;
}

export default function CategorySection({ lang }: { lang: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const isArabic = lang === 'ar';

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories?limit=6');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    const data = JSON.parse(localStorage.getItem('cachedCategories') || null)
    //1 hour 3600000
    //  if (data && data.cachedAt && Date.now() - data.cachedAt < 3600000) {
    if (data && data?.cachedAt) {
      console.log('get from cache')
      setCategories(data.data);
      setLoading(false);
    } else {
      console.log('get from bags')
      fetchCategories();
    }
    // fetchCategories();
  }, []);

  // Placeholder images for categories without images
  const placeholderImages = [
    '/svg/category1.jpg',
    '/svg/category2.jpg',
    '/svg/category3.jpg',
    '/svg/category4.jpg',
    '/svg/category5.jpg',
    '/svg/category6.jpg',
  ];

  if (loading) {
    return (
      <div className="relative bg-gray-100 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">
            { isArabic ? 'تصفح حسب الفئة' : 'Browse by Category' }
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            { [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={ i } className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 animate-pulse"></div>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          { categories.map((category, index) => (
            <Link href={ `/${lang}/categories/${category.slug}` } key={ category._id } className="group">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-32 w-full">
                  <Image
                    src={ category.image || placeholderImages[index % placeholderImages.length] }
                    alt={ isArabic ? category.nameAr : category.name }
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white text-lg font-medium text-center px-2">
                      { isArabic ? category.nameAr : category.name }
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
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