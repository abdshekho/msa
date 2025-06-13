'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/lib/cart/CartContext';
import { updateCartItem, removeFromCart } from '@/app/lib/cart/actions';
import { triggerCartUpdate } from '@/app/lib/cart/cartEvents';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { Tooltip } from 'flowbite-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'Cart' : 'سلة التسوق',
  };
}
export default function CartPageClient() {
  const lang = usePathname().slice(1, 3) || 'en';
  const { cart, loading } = useCart();
  const isArabic = lang === 'ar';
  const hasItems = cart?.items && cart.items.length > 0;

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
    triggerCartUpdate();
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
    triggerCartUpdate();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        { isArabic ? 'سلة التسوق' : 'Shopping Cart' }
      </h1>

      { loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 dark:text-white">{ isArabic ? 'جاري التحميل...' : 'Loading...' }</p>
        </div>
      ) : hasItems ? (
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Cart Items */ }
          <div className="lg:w-2/3" dir='ltr'>
            { cart.items.map((item: any) => (
              <div key={ item._id } className="flex flex-col justify-between py-5 border-b border-gray-200 dark:border-gray-700 gap-2">
                <div className='flex items-center'>
                  <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden">
                    { item.product.imageCover && (
                      <Image
                        src={ item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}` }
                        alt={ isArabic ? item.product.nameAr : item.product.name }
                        fill
                        className="object-cover"
                      />
                    ) }
                  </div>
                  <div className="flex-grow ml-4">
                    <h3 className="text-md md:text-lg font-medium text-primary dark:text-primary-10">
                      { isArabic ? item.product.nameAr : item.product.name }
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">
                      ${ item.price.toFixed(2) }
                    </p>
                  </div>
                </div>


                <div className="flex items-center w-full justify-between">
                  <div className='flex'>
                    <Tooltip content={ lang === 'en' ? "remove one" : "إنقاص واحد" }>
                      <button
                        onClick={ () => handleUpdateQuantity(item._id, item.quantity - 1) }
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        <FaMinus size={ 12 } />
                      </button></Tooltip>
                    <span className="mx-3 w-8 text-center dark:text-white">
                      { item.quantity }
                    </span>
                    <Tooltip content={ lang === 'en' ? "add one" : "إضافة واحد" }>
                      <button
                        onClick={ () => handleUpdateQuantity(item._id, item.quantity + 1) }
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      >
                        <FaPlus size={ 12 } />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="ml-6 text-right font-bold md:text-lg">
                    <span>${ (item.price * item.quantity).toFixed(2) }</span>
                  </div>
                  <Tooltip content={ lang === 'en' ? "remove from cart" : "إزالة من السلة" }>
                    <button
                      onClick={ () => handleRemoveItem(item._id) }
                      className="p-2 mx-2 rounded-full bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-500 hover:text-red-800"
                      aria-label={ isArabic ? 'إزالة من السلة' : 'Remove from cart' }
                    >
                      <FaTrash />
                    </button>
                  </Tooltip>
                </div>

              </div>
            )) }
          </div>

          {/* Order Summary */ }
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-primary dark:text-primary-10 text-center">
                { isArabic ? 'ملخص الطلب' : 'Order Summary' }
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع الفرعي' : 'Subtotal' }</span>
                  <span>${ cart.totalPrice.toFixed(2) }</span>
                </div>
                <div className="flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'الشحن' : 'Shipping' }</span>
                  <span>{ isArabic ? 'حسب العنوان' : 'Based on your address' }</span>
                </div>
                <div className="border-t pt-3 text-md md:text-lg font-bold flex justify-between dark:text-white">
                  <span className='text-secondary dark:text-secondary-10'>{ isArabic ? 'المجموع' : 'Total' }</span>
                  <span className='text-primary dark:text-primary-10'>${ cart.totalPrice.toFixed(2) }</span>
                </div>
              </div>

              <Link
                href={ `/${lang}/checkout` }
                className="block w-full py-3 px-4 bg-primary dark:bg-primary text-white text-center font-medium rounded-md hover:opacity-80 transition-colors"
              >
                { isArabic ? 'إنشاء طلب' : 'Create Order' }
              </Link>

              <Link
                href={ `/${lang}/products` }
                className="block w-full mt-4 py-3 px-4 border border-gray-300 text-center font-medium rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                { isArabic ? 'مواصلة التسوق' : 'Continue Shopping' }
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-medium mb-4 dark:text-white">
            { isArabic ? 'سلة التسوق فارغة' : 'Your cart is empty' }
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            { isArabic
              ? 'لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.'
              : "You haven't added any products to your cart yet." }
          </p>
          <Link
            href={ `/${lang}/products` }
            className="inline-block py-3 px-8 bg-primary text-white font-medium rounded-md hover:bg-primary-10 transition-colors"
          >
            { isArabic ? 'تصفح المنتجات' : 'Browse Products' }
          </Link>
        </div>
      ) }
    </div>
  );
}