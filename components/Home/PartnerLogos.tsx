'use client';

import React from 'react';
import Image from 'next/image';

export default function PartnerLogos({ lang }: { lang: string }) {
  const isArabic = lang === 'ar';

  const partners = [
    { name: 'Microsoft', logo: '/svg/microsoft.svg' },
    { name: 'Google', logo: '/svg/google.svg' },
    { name: 'Amazon', logo: '/svg/amazon.svg' },
    { name: 'Apple', logo: '/svg/apple.svg' },
    { name: 'Samsung', logo: '/svg/samsung.svg' },
    { name: 'IBM', logo: '/svg/ibm.svg' },
    { name: 'Intel', logo: '/svg/intel.svg' },
    { name: 'Oracle', logo: '/svg/oracle.svg' },
  ];

  // كررها 3 مرات
  const repeatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
          { isArabic ? 'شركاؤنا' : 'Our Partners' }
        </h2>

        <div className="overflow-hidden relative w-full">
          <div className="flex animate-marquee w-max">
            { repeatedPartners.map((partner, index) => (
              <div key={ index } className="flex-shrink-0 w-40 mx-8">
                <div className="bg-white dark:bg-gray-800 h-24 rounded-lg shadow flex items-center justify-center p-4">
                  <Image
                    src={ partner.logo }
                    alt={ partner.name }
                    width={ 120 }
                    height={ 60 }
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
            )) }
          </div>
        </div>
      </div>
    </div>
  );
}
