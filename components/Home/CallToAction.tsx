import React from 'react';
import Link from 'next/link';

export default function CallToAction({ lang }: { lang: string }) {
  const isArabic = lang === 'ar';
  
  return (
    <div className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {isArabic 
              ? 'جاهز لتقديم طلبك؟'
              : 'Ready to place your order?'}
          </h2>
          
          <p className="text-lg mb-8 opacity-90">
            {isArabic 
              ? 'تصفح مجموعتنا الواسعة من المنتجات واطلب الآن للحصول على أفضل العروض.'
              : 'Browse our wide collection of products and order now to get the best deals.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${lang}/products`}
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              {isArabic ? 'تسوق الآن' : 'Shop Now'}
            </Link>
            
            <Link 
              href={`/${lang}/contact`}
              className="px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}