'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCategories } from '@/context/CategoryContext';
import ProdcutCard from '../ProdcutCard';

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
  const { categories, loading } = useCategories();

  useEffect(() => {
    // Get products from localStorage
    const getRelatedProducts = () => {
      try {
        if (loading) return
        const allProducts: Product[] = [];
        // Extract all products from the nested structure
        // console.log(loading);
        // console.log(categories);
        categories?.forEach((category: any) => {
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
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      { relatedProducts?.map((product) => (
        <ProdcutCard key={product._id} product={product} lang={lang}/>
      )) }
    </div>
  );
}