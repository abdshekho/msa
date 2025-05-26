'use client';

import React from 'react';
import Image from 'next/image';
import { updateCartItem, removeFromCart } from '@/app/lib/cart/actions';
import { useRouter } from 'next/navigation';

interface CartItemProps {
  item: {
    _id: string;
    product: {
      _id: string;
      name: string;
      nameAr: string;
      price: number;
      imageCover: string;
    };
    quantity: number;
    price: number;
  };
  lang: string;
}

const CartItem: React.FC<CartItemProps> = ({ item, lang }) => {
  const router = useRouter();
  const isArabic = lang === 'ar';
  const productName = isArabic ? item.product.nameAr : item.product.name;
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(item._id, newQuantity);
  };
  
  const handleRemove = async () => {
    await removeFromCart(item._id);
  };
  
  return (
    <div className="flex items-center py-5 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden">
        <Image
          src={item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}`}
          alt={productName}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-grow ml-4">
        <h3 className="text-lg font-medium dark:text-white">
          {productName}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 font-bold">
          ${item.price.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <span className="mx-3 w-8 text-center dark:text-white">
          {item.quantity}
        </span>
        
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="ml-6 text-right">
        <p className="text-lg font-bold dark:text-white">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 text-sm mt-1"
        >
          {isArabic ? 'إزالة' : 'Remove'}
        </button>
      </div>
    </div>
  );
};

export default CartItem;