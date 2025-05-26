import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection({ lang }: { lang: string }) {
  const isArabic = lang === 'ar';
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="relative h-80 w-full rounded-lg overflow-hidden">
              <Image
                src="/svg/about-image.jpg"
                alt={isArabic ? "من نحن" : "About Us"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">
              {isArabic ? 'من نحن' : 'About Us'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {isArabic 
                ? 'نحن شركة متخصصة في توفير منتجات عالية الجودة لعملائنا. نسعى دائمًا لتقديم أفضل الخدمات والمنتجات التي تلبي احتياجات عملائنا وتتجاوز توقعاتهم.'
                : 'We are a company specialized in providing high-quality products to our customers. We always strive to provide the best services and products that meet our customers\' needs and exceed their expectations.'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2">100+</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {isArabic ? 'منتجات متنوعة' : 'Various Products'}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-300">
                  {isArabic ? 'عملاء راضون' : 'Happy Customers'}
                </div>
              </div>
            </div>
            
            <Link 
              href={`/${lang}/about`}
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {isArabic ? 'اقرأ المزيد' : 'Read More'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}