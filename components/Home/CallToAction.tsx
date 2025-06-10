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
              ? 'احسب نظامك الشمسي المثالي'
              : 'Calculate Your Ideal Solar System'}
          </h2>
          
          <p className="text-lg mb-8 opacity-90">
            {isArabic 
              ? 'أدخل الأجهزة التي تستخدمها وسنقوم بحساب احتياجاتك من الألواح الشمسية والبطاريات والمحوّل بدقة. \n احصل على التوصية المثالية للمنتجات التي تناسب استهلاكك اليومي.'
              : 'Enter the devices you use, and we’ll accurately calculate your solar panel, battery, and inverter needs. Get personalized product recommendations based on your daily energy usage.'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href={`/${lang}/solar-calculator`}
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              {isArabic ? 'معرفة النظام الشمسي المناسب لك' : 'Shop Now'}
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