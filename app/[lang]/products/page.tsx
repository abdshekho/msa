'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  imageCover: string;
  category: string;
  brand: string;
}

interface Category {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  nameAr: string;
  slug: string;
}

export default function ProductsPage({ params }: { params: { lang: string } }) {
  // Extract lang from params to avoid direct access
  const resolveParam = use(params);
  const lang = resolveParam.lang;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const pageParam = searchParams.get('page');

  // Set current page from URL parameter
  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    } else {
      setCurrentPage(1);
    }
  }, [pageParam]);

  // Fetch products, categories, and brands
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Construct URL with filters if present
        let url = '/api/products';
        const urlParams = new URLSearchParams();

        if (categoryFilter) {
          urlParams.append('category', categoryFilter);
        }

        if (brandFilter) {
          urlParams.append('brand', brandFilter);
        }

        if (urlParams.toString()) {
          url += `?${urlParams.toString()}`;
        }

        // Fetch products
        const productsRes = await fetch(url);
        const productsData = await productsRes.json();

        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();

        // Fetch brands
        const brandsRes = await fetch('/api/brands');
        const brandsData = await brandsRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryFilter, brandFilter]);

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nameAr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set('page', pageNumber.toString());
    router.push(`/${lang}/products?${urlParams.toString()}`);
    setCurrentPage(pageNumber);
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId: string | null) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      urlParams.set('category', categoryId);
    } else {
      urlParams.delete('category');
    }
    
    // Reset to page 1 when changing filters
    urlParams.delete('page');
    router.push(`/${lang}/products?${urlParams.toString()}`);
  };

  const handleBrandChange = (brandId: string | null) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    if (brandId) {
      urlParams.set('brand', brandId);
    } else {
      urlParams.delete('brand');
    }
    
    // Reset to page 1 when changing filters
    urlParams.delete('page');
    router.push(`/${lang}/products?${urlParams.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(`/${lang}/products`);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Products</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">Filter by Category</label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={categoryFilter || ''}
              onChange={(e) => handleCategoryChange(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {lang === 'ar' ? category.nameAr : category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block mb-2 font-medium dark:text-white">Filter by Brand</label>
            <select
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={brandFilter || ''}
              onChange={(e) => handleBrandChange(e.target.value || null)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {lang === 'ar' ? brand.nameAr : brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <Link href={`/${lang}/products/${product._id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 dark:text-white">
                      {lang === 'ar' ? product.nameAr : product.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md ${
                    currentPage === 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 ${
                        currentPage === number
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 dark:text-white">
          <p className="text-xl text-gray-600 dark:text-gray-300">No products found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}