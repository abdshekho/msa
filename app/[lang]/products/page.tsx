'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';
import { useCategories } from '@/context/CategoryContext';

interface Product {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  imageCover: string;
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

export default function ProductsPage({ params }: { params: { lang: string } }) {
  const resolveParam: any = use(params as any);
  const lang = resolveParam.lang;
  const isArabic = lang === 'ar';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subcategory');
  const pageParam = Number(searchParams.get('page') || '1');
  const minPriceParam = Number(searchParams.get('minPrice') || '0');
  const maxPriceParam = Number(searchParams.get('maxPrice') || '1000');
  const { categories: contextCategories , loading: loadingCategories }:any = useCategories();

  useEffect(() => {
    setCurrentPage(pageParam);
    setPriceRange([minPriceParam, maxPriceParam]);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (subCategoryParam) setSelectedSubCategory(subCategoryParam);
  }, [pageParam, minPriceParam, maxPriceParam, categoryParam, subCategoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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
          // console.log(allProducts)
          // console.log(contextCategories)
          setProducts(allProducts);
        } 
        // else {
        //   // Fallback to API if localStorage data is not available
        //   const productQuery = new URLSearchParams();
        //   if (categoryParam) productQuery.set('category', categoryParam);
        //   if (minPriceParam) productQuery.set('minPrice', String(minPriceParam));
        //   if (maxPriceParam) productQuery.set('maxPrice', String(maxPriceParam));

        //   const productUrl = `/api/products${productQuery.toString() ? '?' + productQuery.toString() + '&fields=_id,name,nameAr,price,imageCover,slug' : ''}`;
        //   const categoriesRes = await fetch('/api/categories?fields=_id,name,nameAr,slug');
          
        //   const [productsData, categoriesData] = await Promise.all([
        //     (await fetch(productUrl)).json(),
        //     categoriesRes.json()
        //   ]);

        //   setProducts(productsData);
        //   setCategories(categoriesData);
        // }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    if(loadingCategories) return
    fetchData();
  }, [categoryParam, minPriceParam, maxPriceParam,loadingCategories]);

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
    
    // Filter by price range
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    // If no category filter is applied
    if (selectedCategory === 'all') {
      return matchesSearch && matchesPrice;
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
    
    return matchesSearch && matchesPrice && belongsToSelectedCategory && belongsToSelectedSubCategory;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const updateQuery = (updates: { [key: string]: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value === null ? params.delete(key) : params.set(key, value)
    );
    params.delete('page'); // Reset pagination
    router.push(`/${lang}/products?${params.toString()}`);
  };

  const paginate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/${lang}/products?${params.toString()}`);
    setCurrentPage(page);
  };

  const clearFilters = () => {
    router.push(`/${lang}/products`);
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setSelectedCategory('all');
    setSelectedSubCategory('all');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          {isArabic ? 'المنتجات' : 'Products'}
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder={isArabic ? "البحث عن منتجات..." : "Search products..."}
          className="w-full my-6 p-2 shadow-md rounded  bg-card-10 dark:bg-gray-700 dark:text-white border-2 border-card-10 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
          <div>
            <label className="block mb-2 font-bold text-secondary dark:text-secondary-10">
              {isArabic ? 'الفئة' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory('all');
                updateQuery({ 
                  category: e.target.value === 'all' ? null : e.target.value,
                  subcategory: null
                });
              }}
              className="w-full p-3 border-none outline-0 shadow-md rounded bg-card-10 dark:bg-gray-700 dark:text-white"
            >
              <option className='p-2 border border-b-[1px]' value="all">{isArabic ? 'الكل' : 'All'}</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {isArabic ? cat.nameAr : cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-bold text-secondary dark:text-secondary-10">
              {isArabic ? 'الفئة الفرعية' : 'Subcategory'}
            </label>
            <select
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                updateQuery({ 
                  subcategory: e.target.value === 'all' ? null : e.target.value 
                });
              }}
              className="w-full p-3 border-none outline-0 shadow-md rounded bg-card-10 dark:bg-gray-700 dark:text-white"
              disabled={selectedCategory === 'all'}
            >
              <option value="all">{isArabic ? 'الكل' : 'All'}</option>
              {getSubCategories().map(subCat => (
                <option key={subCat._id} value={subCat._id}>
                  {isArabic ? subCat.nameAr : subCat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-bold text-secondary dark:text-secondary-10">
              {isArabic ? 'نطاق السعر' : 'Price Range'}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={priceRange[0]}
                min={0}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="w-1/3 p-2 shadow-md rounded  bg-card-10 dark:bg-gray-700 dark:text-white border-2 border-card-10 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="dark:text-white">-</span>
              <input
                type="number"
                value={priceRange[1]}
                min={priceRange[0]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-1/3 p-2 shadow-md rounded  bg-card-10 dark:bg-gray-700 dark:text-white border-2 border-card-10 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() =>
                  updateQuery({
                    minPrice: String(priceRange[0]),
                    maxPrice: String(priceRange[1])
                  })
                }
                className="text-white px-3 py-2 rounded bg-primary hover:opacity-80"
              >
                {isArabic ? 'تطبيق' : 'Apply'}
              </button>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={clearFilters}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-secondary dark:text-secondary-10 py-2 px-4 rounded"
            >
              {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <Link href={`/${lang}/products/${product._id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
                      alt={product.name}
                      fill
                      className="object-contain hover:opacity-80"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold text-lg my-6 text-center text-primary dark:text-primary-10">
                    { product.name}
                  </h3>
                  <div className='flex justify-between items-center'>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">${product.price.toFixed(2)}</span>
                    <AddToCartButton productId={product._id.toString()} lang={lang} className='text-base flex items-center gap-2 text-white bg-green-600 dark:bg-green-700 px-2 py-2 rounded-lg'/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center my-20" dir='ltr'>
              <nav className="flex items-center gap-2 md:gap-4 flex-wrap">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 shadow-2xl rounded-l-md bg-card-10 dark:bg-gray-700 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-secondary hover:text-white'}`}
                >
                  {isArabic ? 'السابق' : 'Previous'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => paginate(num)}
                    className={`px-4 py-2 shadow-2xl rounded-full mx-1 ${num === currentPage ? 'bg-primary rounded-full text-white' : 'hover:bg-secondary hover:text-white bg-card-10 dark:bg-gray-700  '}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 shadow-2xl rounded-r-md bg-card-10 dark:bg-gray-700 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-secondary hover:text-white'}`}
                >
                  {isArabic ? 'التالي' : 'Next'}
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 dark:text-white">
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isArabic ? 'لم يتم العثور على منتجات تطابق معايير البحث.' : 'No products found matching your criteria.'}
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-primary  text-white py-2 px-4 rounded"
          >
            {isArabic ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
}