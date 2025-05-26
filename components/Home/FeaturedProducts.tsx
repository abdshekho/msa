'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  nameAr: string;
  price: number;
  imageCover: string;
}

export default function FeaturedProducts({ lang }: { lang: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isArabic = lang === 'ar';

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/products?limit=4');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isArabic ? 'منتجات مميزة' : 'Featured Products'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {isArabic ? 'منتجات مميزة' : 'Featured Products'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/${lang}/products/${product._id}`} key={product._id} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
                  alt={isArabic ? product.nameAr : product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {isArabic ? product.nameAr : product.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          href={`/${lang}/products`}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {isArabic ? 'عرض جميع المنتجات' : 'View All Products'}
        </Link>
      </div>
    </div>
  );
}