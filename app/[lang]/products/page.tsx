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
    const resolveParam = use(params);
  const lang = resolveParam.lang;
  // const lang = params.lang;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFilter = searchParams.get('category');
  const brandFilter = searchParams.get('brand');
  const pageParam = Number(searchParams.get('page') || '1');
  const minPriceParam = Number(searchParams.get('minPrice') || '0');
  const maxPriceParam = Number(searchParams.get('maxPrice') || '1000');

  useEffect(() => {
    setCurrentPage(pageParam);
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [pageParam, minPriceParam, maxPriceParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productQuery = new URLSearchParams();
        if (categoryFilter) productQuery.set('category', categoryFilter);
        if (brandFilter) productQuery.set('brand', brandFilter);
        if (minPriceParam) productQuery.set('minPrice', String(minPriceParam));
        if (maxPriceParam) productQuery.set('maxPrice', String(maxPriceParam));

        const productUrl = `/api/products${productQuery.toString() ? '?' + productQuery.toString() : ''}`;

        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          fetch(productUrl),
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);

        const [productsData, categoriesData, brandsData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
          brandsRes.json()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryFilter, brandFilter, minPriceParam, maxPriceParam]);

  const filteredProducts = products.filter(product =>
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.nameAr.toLowerCase().includes(searchTerm.toLowerCase())) &&
    product.price >= priceRange[0] &&
    product.price <= priceRange[1]
  );

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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */ }
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Products</h1>
      </div>

      {/* Filters */ }
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={ searchTerm }
          onChange={ (e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          } }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 font-medium dark:text-white">Category</label>
            <select
              value={ categoryFilter || '' }
              onChange={ (e) => updateQuery({ category: e.target.value || null }) }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All</option>
              { categories.map(cat => (
                <option key={ cat._id } value={ cat._id }>
                  { lang === 'ar' ? cat.nameAr : cat.name }
                </option>
              )) }
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium dark:text-white">Brand</label>
            <select
              value={ brandFilter || '' }
              onChange={ (e) => updateQuery({ brand: e.target.value || null }) }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="">All</option>
              { brands.map(brand => (
                <option key={ brand._id } value={ brand._id }>
                  { lang === 'ar' ? brand.nameAr : brand.name }
                </option>
              )) }
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium dark:text-white">Price Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={ priceRange[0] }
                min={ 0 }
                onChange={ (e) => setPriceRange([+e.target.value, priceRange[1]]) }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <span className="dark:text-white">-</span>
              <input
                type="number"
                value={ priceRange[1] }
                min={ priceRange[0] }
                onChange={ (e) => setPriceRange([priceRange[0], +e.target.value]) }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              <button
                onClick={ () =>
                  updateQuery({
                    minPrice: String(priceRange[0]),
                    maxPrice: String(priceRange[1])
                  })
                }
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={ clearFilters }
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */ }
      { loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          { Array(8).fill(0).map((_, i) => <ProductSkeleton key={ i } />) }
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            { currentProducts.map(product => (
              <div key={ product._id } className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <Link href={ `/${lang}/products/${product._id}` }>
                  <div className="relative h-48 w-full">
                    <Image
                      src={ product.imageCover.startsWith('/') ? product.imageCover : `/${product.imageCover}` }
                      alt={ product.name }
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 dark:text-white">
                      { lang === 'ar' ? product.nameAr : product.name }
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">${ product.price.toFixed(2) }</p>
                  </div>
                </Link>
              </div>
            )) }
          </div>

          {/* Pagination */ }
          { totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={ () => paginate(currentPage - 1) }
                  disabled={ currentPage === 1 }
                  className={ `px-3 py-1 rounded-l-md ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}` }
                >
                  Previous
                </button>
                { Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={ num }
                    onClick={ () => paginate(num) }
                    className={ `px-3 py-1 ${num === currentPage ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}` }
                  >
                    { num }
                  </button>
                )) }
                <button
                  onClick={ () => paginate(currentPage + 1) }
                  disabled={ currentPage === totalPages }
                  className={ `px-3 py-1 rounded-r-md ${currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}` }
                >
                  Next
                </button>
              </nav>
            </div>
          ) }
        </>
      ) : (
        <div className="text-center py-12 dark:text-white">
          <p className="text-xl text-gray-600 dark:text-gray-300">No products found matching your criteria.</p>
          <button
            onClick={ clearFilters }
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Reset Filters
          </button>
        </div>
      ) }
    </div>
  );
}
