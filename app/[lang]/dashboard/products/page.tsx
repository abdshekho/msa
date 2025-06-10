'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCategories } from '@/context/CategoryContext';

interface Product {
  _id: string;
  name: string;
  nameAr: string;
  price: number;
  imageCover: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  image: string;
  items: Product[];
}

interface Category {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  image: string;
  items: SubCategory[];
}

const ProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
    <div className="h-48 w-full bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const params = useParams();
  const { categories: contextCategories, loading: loadingCategories } = useCategories();
  
  const lang = params.lang as string;
  const isArabic = lang === 'ar';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Try to get categories from localStorage first
        // const cachedData = localStorage.getItem('cachedCategories');
        
        if (contextCategories && contextCategories?.length) {
          // const parsedData = JSON.parse(cachedData);
          setCategories(contextCategories);
          
          // Extract all products from categories
          const allProducts: Product[] = [];
          contextCategories.forEach((category: Category) => {
            category.items.forEach((subCategory: SubCategory) => {
              if (subCategory.items && subCategory.items.length > 0) {
                allProducts.push(...subCategory.items);
              }
            });
          });
          
          setProducts(allProducts);
          setLoading(false);
        } else {
          // Fallback to API if localStorage data is not available
          // const response = await fetch('/api/products');
          // if (!response.ok) {
          //   throw new Error('Failed to fetch products');
          // }
          // const data = await response.json();
          // setProducts(data);
          // setLoading(false);
        }
      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    if(loadingCategories) return
    fetchProducts();
  }, [loadingCategories]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(isArabic ? 'هل أنت متأكد أنك تريد حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Remove the deleted product from the state
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      setError(isArabic ? 'خطأ في حذف المنتج. يرجى المحاولة مرة أخرى.' : 'Error deleting product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  // Get available subcategories based on selected category
  const getSubCategories = () => {
    if (selectedCategory === 'all') {
      return [];
    }
    
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? category.items : [];
  };

  // Filter products based on selected filters and search term
  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
      // ||product.nameAr.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If no category filter is applied
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    
    // Find which category and subcategory this product belongs to
    let belongsToSelectedCategory = false;
    let belongsToSelectedSubCategory = selectedSubCategory === 'all';
    
    for (const category of categories) {
      if (category._id === selectedCategory) {
        for (const subCategory of category.items) {
          const productInSubCategory = subCategory.items.some(item => item._id === product._id);
          
          if (productInSubCategory) {
            belongsToSelectedCategory = true;
            
            if (selectedSubCategory === 'all' || subCategory._id === selectedSubCategory) {
              belongsToSelectedSubCategory = true;
            }
          }
        }
      }
    }
    
    return matchesSearch && belongsToSelectedCategory && belongsToSelectedSubCategory;
  });

  if (loadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">{isArabic ? 'إدارة المنتجات' : 'Product Management'}</h1>
        <Link
          href={`/${lang}/dashboard/Product`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isArabic ? 'إضافة منتج جديد' : 'Add New Product'}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isArabic ? 'البحث عن منتج...' : 'Search products...'}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-4"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isArabic ? 'الفئة' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('all');
              }}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">{isArabic ? 'جميع الفئات' : 'All Categories'}</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {isArabic ? category.nameAr : category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isArabic ? 'الفئة الفرعية' : 'Subcategory'}
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              disabled={selectedCategory === 'all'}
            >
              <option value="all">{isArabic ? 'جميع الفئات الفرعية' : 'All Subcategories'}</option>
              {getSubCategories().map(subCategory => (
                <option key={subCategory._id} value={subCategory._id}>
                  {isArabic ? subCategory.nameAr : subCategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 dark:text-white">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex justify-between mt-2">
                  <Link 
                    href={`/${lang}/dashboard/Product?id=${product._id}`} 
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    {isArabic ? 'تعديل' : 'Edit'}
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    {isArabic ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}