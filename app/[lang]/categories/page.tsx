import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import Image from 'next/image';
import CategoriesHero from '@/components/categories/CategoriesHero';

async function getCategories() {
  try {
    // Use nested=true to get a hierarchical structure of categories
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?nested=true&withProductCount=true`, {
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

  // console.log('🚀 ~ page.tsx ~ CategoriesPage ~ categories:', categories);


  return (
    <div className="mx-auto">
      <CategoriesHero lang={lang} />
      <div className='container mx-auto px-4 py-16'>
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{direction: lang === 'en' ? "ltr" : "rtl"}}>
          {lang === 'en' ? 'Find What You\'re Looking For' : 'ابحث عما تبحث عنه'}
        </h1>
        <p className="text-sm md:text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto" style={{direction: lang === 'en' ? "ltr" : "rtl"}}>
          {lang === 'en' 
            ? 'Browse our categories to quickly find the products that best suit your solar energy needs. Each category is carefully curated to help you make the right choice with ease.'
            : 'تصفح فئاتنا للعثور بسرعة على المنتجات التي تناسب احتياجاتك من الطاقة الشمسية. تم تنظيم كل فئة بعناية لمساعدتك على اتخاذ الخيار الصحيح بسهولة.'
          }
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <div key={category._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6" style={{direction: lang === 'en' ? "ltr" : "rtl"}}>
                <div className='flex justify-between items-center'>
                  <h2 className="text-lg md:text-2xl text-primary dark:text-primary font-bold mb-4">
                    {lang === 'en' ? category.name : (category.nameAr || category.name)}
                  </h2>
                  <span className="px-3 py-2 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                    {category?.items.length} {lang === 'en' 
                      ? (category?.items.length === 1 ? 'category' : 'categories') 
                      : 'فئة'}
                  </span>
                </div>

                {category.image && (
                  <div className="relative h-40 mb-4">
                    <Image
                      src={category.image}
                      alt={lang === 'en' ? category.name : (category.nameAr || category.name)}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-md md:text-xl font-medium mb-2 text-secondary dark:text-secondary-10">
                    {lang === 'en' ? (dictionary.page.categories?.subcategories || 'Subcategories') : 'الفئات الفرعية'}
                  </h3>
                  <ul className="space-y-2">
                    {category.items && category.items.map((subcategory: any) => (
                      <li key={subcategory._id}>
                        <Link
                          href={`/${lang}/categories/${category.slug}/${subcategory.slug}`}
                          className="text-blue-600 dark:text-blue-400 flex justify-between items-center"
                        >
                          <div className='flex hover:underline'>
                            <div className="relative w-8 h-8 mr-2">
                              {subcategory.image && (
                                <Image
                                  src={subcategory.image}
                                  alt={lang === 'en' ? subcategory.name : (subcategory.nameAr || subcategory.name)}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              )}
                            </div>
                            {lang === 'en' ? subcategory.name : (subcategory.nameAr || subcategory.name)}
                          </div>
                          {subcategory.productCount !== undefined && (
                            <span className="px-3 py-2 text-black dark:text-white bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                              {subcategory.productCount} {lang === 'en'
                                ? (subcategory.productCount === 1 ? 'product' : 'products')
                                : 'منتج'}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/${lang}/categories/${category.slug}`}
                  className="mt-6 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-10 transition"
                >
                  {lang === 'en' ? (dictionary.common?.viewAll || 'View All') : 'عرض الكل'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}