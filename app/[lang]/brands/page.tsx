import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import Image from 'next/image';
import BrandsHero from '@/components/brands/BrandsHero';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
      const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'Brands' : 'العلامات التجارية',
  };
}
function truncate(text:string, maxLength = 50) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

async function getBrands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/brands?includeProductCount=true`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch brands');
    }

    return res.json();
  } catch (error) {
    console.error('Error loading brands:', error);
    return [];
  }
}

export default async function BrandsPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  const brands = await getBrands();

  // console.log('🚀 ~ page.tsx ~ BrandsPage ~ brands:', brands);


  return (
    <div >
      <BrandsHero lang={ lang } />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">{ dictionary.page.brands?.ourBrands }</h1>
        <p className="text-sm md:text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          { dictionary.page.brands?.descCard }
          {/* We offer a wide range of solar power services to meet your energy needs. Our team of experts is dedicated to providing high-quality solutions tailored to your specific requirements. */ }
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          { brands.map((brand: any) => (
            <Link
              key={ brand._id }
              href={ `/${lang}/brands/${brand.slug}` }
              className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-2 md:p-4 flex flex-col items-center">
                { brand.image && (
                  <div className="relative h-30 w-30 mb-4">
                    <Image
                      src={ brand.image }
                      alt={ brand.name }
                      fill
                      sizes='120px'
                      className="object-contain group-hover:opacity-40"
                    />
                  </div>
                ) }
                <h2 className="text-lg md:text-xl font-semibold text-primary text-center">{ lang === 'en' ? brand.name : brand.nameAr }</h2>
                <span className='text-sm md:text-md text-secondary-10 my-2 text-center'>{ truncate(lang === 'en' ? brand.description : brand.descriptionAr) }</span>
                { brand.productCount !== undefined && (
                  <span className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                    { brand.productCount }
                    {lang === 'en'?( brand.productCount === 1 ? ' product' : ' products'):' منتج '}
                    
                  </span>
                ) }
              </div>
            </Link>
          )) }
        </div>
      </div>
    </div>
  );
}