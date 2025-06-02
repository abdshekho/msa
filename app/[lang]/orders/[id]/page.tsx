'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/app/lib/orders/actions';
import Link from 'next/link';
import Image from 'next/image';


export default function OrderDetailsPage({ params }: { params: { lang: string, id: string } }) {
  const { lang, id } = use(params);

  const isArabic = lang === 'ar';
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        const orderData = await getOrderById(id);
        console.log('🚀 ~ page.tsx ~ loadOrder ~ orderData:', orderData);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
        setError(isArabic ? 'حدث خطأ أثناء تحميل الطلب' : 'Error loading order details');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  // }, [id, lang, router, isArabic]);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-primary-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400">
          { error }
        </div>
        <div className="mt-4">
          <Link
            href={ `/${lang}/orders` }
            className="text-secondary dark:text-secondary-10 hover:underline"
          >
            { isArabic ? 'العودة إلى الطلبات' : 'Back to Orders' }
          </Link>
        </div>
      </div>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Translate status
  const getStatusText = (status: string) => {
    if (isArabic) {
      switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'processing': return 'قيد المعالجة';
        case 'shipped': return 'تم الشحن';
        case 'delivered': return 'تم التوصيل';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-10">
          { isArabic ? 'تفاصيل الطلب' : 'Order Details' }
        </h1>
        <Link
          href={ `/${lang}/orders` }
          className=" text-secondary dark:text-secondary-10 hover:underline"
        >
          { isArabic ? 'العودة إلى الطلبات' : 'Back to Orders' }
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Order Header */ }
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between">
            <div className='text-center'>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'رقم الطلب' : 'Order ID' }
              </p>
              <p className="font-medium dark:text-white">#{ order?._id }</p>
            </div>
            <div className='text-center'>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'تاريخ الطلب' : 'Order Date' }
              </p>
              {/* <p className="font-medium dark:text-white">{ orderDate }</p> */ }
              <p className="font-medium dark:text-white">{ order?.createdAt.slice(0,10) }</p>
            </div>
            <div className='text-center'>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'وقت الطلب' : 'Order Time' }
              </p>
              <p className="font-medium dark:text-white tracking-[1px]">{ order?.createdAt.split('T')[1].slice(0, 5) }</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'حالة الطلب' : 'Order Status' }
              </p>
              <span className={ `inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}` }>
                { getStatusText(order.status) }
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */ }
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-secondary dark:text-secondary-10">
            { isArabic ? 'المنتجات' : 'Products' }
          </h2>
          <div className="space-y-4">
            { order?.items.map((item: any, index: number) => (
              <div key={ index } className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center">
                  { item.product.imageCover && (
                    <div className="w-16 h-16 relative mr-4">
                      <Image
                        src={ item.product.imageCover }
                        alt={ isArabic ? item.product.nameAr : item.product.name }
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  ) }
                  <div>
                    <h3 className="font-medium text-primary dark:text-primary-10">
                      { isArabic ? item.product.nameAr : item.product.name }
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      { isArabic ? 'الكمية:' : 'Quantity:' } { item.quantity }
                    </p>
                  </div>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <p className="font-medium  text-primary dark:text-primary-10">
                    ${ (item.price * item.quantity).toFixed(2) }
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${ item.price.toFixed(2) } { isArabic ? 'لكل وحدة' : 'each' }
                  </p>
                </div>
              </div>
            )) }
          </div>
        </div>

        {/* Shipping Information */ }
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-secondary dark:text-secondary-10">
            { isArabic ? 'معلومات الشحن' : 'Shipping Information' }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'الاسم' : 'Name' }
              </p>
              <p className="font-medium dark:text-white">{ order?.shippingAddress.name }</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'رقم الهاتف' : 'Phone' }
              </p>
              <p className="font-medium dark:text-white">{ order?.shippingAddress.phone }</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'العنوان' : 'Address' }
              </p>
              <p className="font-medium dark:text-white">{ order?.shippingAddress.address }</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                { isArabic ? 'المدينة' : 'City' }
              </p>
              <p className="font-medium dark:text-white">{ order?.shippingAddress.city }</p>
            </div>
            { order?.shippingAddress.postalCode && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  { isArabic ? 'الرمز البريدي' : 'Postal Code' }
                </p>
                <p className="font-medium dark:text-white">{ order?.shippingAddress.postalCode }</p>
              </div>
            ) }
          </div>
        </div>

        {/* Order Summary */ }
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-secondary dark:text-secondary-10">
            { isArabic ? 'ملخص الطلب' : 'Order Summary' }
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                { isArabic ? 'المجموع الفرعي' : 'Subtotal' }
              </span>
              <span className="font-medium dark:text-white">${ order?.totalPrice.toFixed(2) }</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                { isArabic ? 'الشحن' : 'Shipping' }
              </span>
              <span className="font-medium dark:text-white">{ isArabic ? '_____' : '_____' }</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-secondary dark:text-secondary-10">
                  { isArabic ? 'المجموع الكلي' : 'Total' }
                </span>
                <span className="font-bold text-lg text-primary dark:text-primary-10">
                  ${ order?.totalPrice.toFixed(2) }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}