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
  category: string;
  brand?: string;
  desc: string;
  descAr: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const lang = params.lang as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Error loading products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
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
      setError('Error deleting product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

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
        <span className="block sm:inline"> { error }</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link
          href={ `/${lang}/dashboard/Product` }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Arabic Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            { products.length === 0 ? (
              <tr>
                <td colSpan={ 6 } className="px-4 py-2 text-center border">No products found</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={ product._id }>
                  <td className="px-4 py-2 border">
                    <div className="relative h-16 w-16">
                      <Image
                        src={ product.imageCover }
                        alt={ product.name }
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border">{ product.name }</td>
                  <td className="px-4 py-2 border">{ product.nameAr }</td>
                  <td className="px-4 py-2 border">${ product.price }</td>
                  <td className="px-4 py-2 border">{ product.category }</td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      {/* <Link 
                        href={`/${lang}/dashboard/Admin/products/edit/${product._id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Edit
                      </Link> */}
                      <Link href={ `/${lang}/dashboard/Product?id=${product._id}` } className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm">
                        Edit Product
                      </Link>
                      <button
                        onClick={ () => handleDelete(product._id) }
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) }
          </tbody>
        </table>
      </div>
    </div>
  );
}