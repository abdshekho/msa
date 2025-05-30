'use client';

import React from 'react';
import Image from 'next/image';
import firstsolar from "public/en/companies/firstsolar.png"
import voltronicpower from "public/en/companies/voltronicpower.png"
import Jinko from "public/en/companies/jinko2.png"
import Deye from "public/en/companies/Deye.png"

export default function PartnerLogos({ lang }: { lang: string }) {
  const isArabic = lang === 'ar';

  const partners = [
    { name: 'APC', logo: '/companies/APC_logo_toggle.svg', back: '#ffffff' },
    { name: 'Jinko', logo: Jinko, back: '#37ab30' },
    { name: 'Jinko', logo: Deye, back: '#ffffff' },
    { name: 'ASCO', logo: '/companies/ASCO_logo_toggle.svg',back: '#ffffff' },
    { name: 'Impact', logo: '/companies/Impact Co logo English Black-01-177x54.svg', back: '#ffffff' },
    { name: 'squareD', logo: '/companies/squareD.svg', back: '#50b163' },
    { name: 'sunpower', logo: '/companies/Sunpower-Logo-White.svg', back: '#374151' },
    { name: 'firstsolar', logo: firstsolar, back: '#ffffff' },
    { name: 'voltronicpower', logo: voltronicpower, back: '#ffffff' },
  ];


  // كررها 3 مرات
  const repeatedPartners = [...partners, ...partners, ...partners];
  // const repeatedPartners = [...partners];

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12" style={{direction:"ltr"}}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white">
          { isArabic ? 'شركاؤنا' : 'Our Partners' }
        </h2>

        <div className="overflow-hidden relative w-full">
          <div className="flex animate-marquee w-max">
          {/* <div className="flex w-max"> */}
            { repeatedPartners.map((partner, index) => (
              <div key={ index } className="flex-shrink-0 w-40 mx-8">
                <div className={ `h-24 rounded-lg shadow flex items-center justify-center p-4` } style={{ backgroundColor: partner.back }}>
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
            {/* { partnersImage.map((partner, index) => (
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
            )) } */}
          </div>
        </div>
      </div>
    </div>
  );
}
