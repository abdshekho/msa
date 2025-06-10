'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  imageCover: string;
  price: number;
}

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  brandId?: string;
  lang: string;
}

export default function RelatedProducts({ productId, categoryId, brandId, lang }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const isArabic = lang === 'ar';

  useEffect(() => {
    // Get products from localStorage
    const getRelatedProducts = () => {
      try {
        const storedData = localStorage.getItem('cachedCategories');
        if (!storedData) return [];
        
        const parsedData = JSON.parse(storedData);
        const allProducts: Product[] = [];
        
        // Extract all products from the nested structure
        parsedData.data?.forEach((category: any) => {
          category.items?.forEach((subCategory: any) => {
            subCategory.items?.forEach((product: any) => {
              if (product._id !== productId) {
                allProducts.push(product);
              }
            });
          });
        });
        
        // Filter products by same category and brand if available
        let filtered = allProducts;
        
        // For now, just return up to 4 random products
        return filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
      } catch (error) {
        console.error('Error getting related products:', error);
        return [];
      }
    };
    
    setRelatedProducts(getRelatedProducts());
  }, [productId, categoryId, brandId]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Link 
          href={`/${lang}/products/${product._id}`} 
          key={product._id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 w-full">
            <Image
              src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
              alt={isArabic ? product.nameAr || product.name : product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-primary dark:text-primary-10 truncate">
              {isArabic ? product.nameAr || product.name : product.name}
            </h3>
            <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">
              ${product.price?.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}