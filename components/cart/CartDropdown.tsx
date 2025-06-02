'use client';

import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { getCart } from '@/app/lib/cart/actions';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/lib/cart/CartContext';

export default function CartDropdown() {
  const { cart, loading, refreshCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';
  const isArabic = lang === 'ar';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const itemCount = cart?.items?.length || 0;

  return (
    <div className="relative flex" ref={ dropdownRef } style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
      <button
        onClick={ () => setIsOpen(!isOpen) }
        className="flex items-center text-secondary dark:text-[lightgray] hover:text-secondary-10 dark:hover:text-secondary-10 focus:outline-none"
      >
        <div className="relative">
          <FaShoppingCart className="w-7 h-7" />
          { itemCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-primary-10 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              { itemCount }
            </span>
          ) }
        </div>
      </button>

      { isOpen && (
        <div className="absolute right-0 mt-5 w-80 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50 py-2 dropDown_Cart">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-gray-900 dark:text-white text-center font-bold">
              { isArabic ? 'سلة التسوق' : 'Shopping Cart' } ({ itemCount })
            </h3>
          </div>

          <div className="max-h-60 overflow-y-auto">
            { loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                { isArabic ? 'جاري التحميل...' : 'Loading...' }
              </div>
            ) : cart?.items?.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                { isArabic ? 'السلة فارغة' : 'Your cart is empty' }
              </div>
            ) : (
              cart?.items?.map((item) => (
                <div key={ item._id } className=' p-3 border-b border-gray-200 dark:border-gray-600 last:border-0'>
                  <div  className="flex items-center">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={ item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}` }
                        alt={ isArabic ? item.product.nameAr : item.product.name }
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-primary dark:text-primary-10 truncate text-center">
                        { isArabic ? item.product.nameAr : item.product.name }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold text-secondary dark:text-secondary-10">
                    <p className="text-xs text-gray-500 dark:text-gray-400" style={ { direction: 'ltr' } }>
                      { item.quantity } x ${ item.price.toFixed(2) }
                    </p>
                    <p>
                      ${ (item.price * item.quantity).toFixed(2) }
                    </p>
                  </div>
                </div>
              ))
            ) }
          </div>

          { cart?.items?.length > 0 && (
            <>
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                <span className="font-bold text-secondary dark:text-secondary-10">
                  { isArabic ? 'المجموع : ' : 'Total :' }
                </span>
                <span className="font-bold text-primary">
                  ${ cart?.totalPrice?.toFixed(2) || '0.00' }
                </span>
              </div>
              <div className="px-4 py-2">
                <Link
                  href={ `/${lang}/cart` }
                  className="block w-full text-center py-2 px-4 bg-primary hover:bg-primary-10 text-white rounded-md"
                  onClick={ () => setIsOpen(false) }
                >
                  { isArabic ? 'عرض السلة' : 'View Cart' }
                </Link>
              </div>
            </>
          ) }
        </div>
      ) }
    </div>
  );
}