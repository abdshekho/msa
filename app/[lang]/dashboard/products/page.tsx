'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const params = useParams();
  const lang = params.lang as string;
  const isArabic = lang === 'ar';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Try to get categories from localStorage first
        const cachedData = localStorage.getItem('cachedCategories');
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCategories(parsedData.data);
          
          // Extract all products from categories
          const allProducts: Product[] = [];
          parsedData.data.forEach((category: Category) => {
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
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isArabic ? 'إدارة المنتجات' : 'Product Management'}</h1>
        <Link
          href={`/${lang}/dashboard/Product`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isArabic ? 'إضافة منتج جديد' : 'Add New Product'}
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isArabic ? 'البحث' : 'Search'}
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isArabic ? 'البحث عن منتج...' : 'Search products...'}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isArabic ? 'الفئة' : 'Category'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory('all');
            }}
            className="w-full p-2 border rounded"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isArabic ? 'الفئة الفرعية' : 'Subcategory'}
          </label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full p-2 border rounded"
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 border">{isArabic ? 'الصورة' : 'Image'}</th>
              <th className="px-4 py-2 border">{isArabic ? 'الاسم' : 'Name'}</th>
              <th className="px-4 py-2 border">{isArabic ? 'الاسم بالعربية' : 'Arabic Name'}</th>
              <th className="px-4 py-2 border">{isArabic ? 'السعر' : 'Price'}</th>
              <th className="px-4 py-2 border">{isArabic ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center border dark:text-white">
                  {isArabic ? 'لم يتم العثور على منتجات' : 'No products found'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="dark:text-white">
                  <td className="px-4 py-2 border">
                    <div className="relative h-16 w-16">
                      <Image
                        src={product.imageCover}
                        alt={isArabic ? product.nameAr : product.name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.nameAr}</td>
                  <td className="px-4 py-2 border">${product.price}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/${lang}/dashboard/Product?id=${product._id}`} 
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        {isArabic ? 'تعديل' : 'Edit'}
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        {isArabic ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}