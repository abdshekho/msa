import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

async function getBrandBySlug(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/brands?slug=${slug}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch brand');
    }

    const brands = await res.json();
    return brands[0]; // Return the first brand that matches the slug
  } catch (error) {
    console.error('Error loading brand:', error);
    return null;
  }
}

async function getProductsByBrand(brandId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?brand=${brandId}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export default async function BrandDetailPage(props: { params: Promise<{ lang: Locale, slug: string }> }) {
  const { lang, slug } = await props.params;
  const dictionary = await getDictionary(lang);
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{ dictionary.common?.notFound || 'Brand not found' }</h1>
      </div>
    );
  }

  const products = await getProductsByBrand(brand._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={ `/${lang}/brands` } className="text-blue-600 dark:text-blue-400 hover:underline">
          ← { dictionary.common?.backToBrands || 'Back to Brands' }
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        { brand.image && (
          <div className="md:w-1/3">
            <div className="relative h-64 w-full">
              <Image
                src={ brand.image }
                alt={ brand.name }
                fill
                className="object-contain bg-white dark:bg-gray-700 rounded-lg p-4"
              />
            </div>
          </div>
        ) }

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{ brand.name }</h1>
          { brand.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{ brand.description }</p>
          ) }
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{ dictionary.products?.byThisBrand || 'Products by this brand' }</h2>

      { products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          { products.map((product: any) => (
            <div key={ product._id } className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={ product.imageCover }
                  alt={ product.name }
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{ product.name }</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">${ product.price.toFixed(2) }</p>
                <Link
                  href={ `/${lang}/products/${product._id}` }
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full text-center"
                >
                  { dictionary.common?.viewDetails || 'View Details' }
                </Link>
              </div>
            </div>
          )) }
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          { dictionary.products?.noProductsByBrand || 'No products found for this brand.' }
        </p>
      ) }
    </div>
  );
}