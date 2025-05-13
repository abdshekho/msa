import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Link from 'next/link';
import Image from 'next/image';

async function getBrands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/brands`, {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{ dictionary.brands?.allBrands || 'All Brands' }</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        { brands.map((brand: any) => (
          <Link
            key={ brand._id }
            href={ `/${lang}/brands/${brand.slug}` }
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-4 flex flex-col items-center">
              { brand.image && (
                <div className="relative h-24 w-24 mb-4">
                  <Image
                    src={ brand.image }
                    alt={ brand.name }
                    fill
                    className="object-contain"
                  />
                </div>
              ) }
              <h2 className="text-lg font-semibold text-center">{ brand.name }</h2>
            </div>
          </Link>
        )) }
      </div>
    </div>
  );
}