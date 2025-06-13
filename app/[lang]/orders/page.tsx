import React from 'react';
import { getUserOrders } from '@/app/lib/orders/actions';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Locale } from '@/i18n-config';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const resolvedParam = await params;
  return {
    title: resolvedParam.lang === 'en' ? 'orders' : 'الطلبات',
  };
}
export default async function OrdersPage({ params }: { params: { lang: string } }) {
  const resolvedParam = await params;
  const lang = resolvedParam.lang;
  const isArabic = lang === 'ar';

  // Check if user is logged in
  const session = await getServerSession();

  if (!session?.user) {
    // Redirect to login if not logged in
    redirect(`/${lang}/auth/signin?callbackUrl=/${lang}/orders`);
  }

  // Get user orders
  const orders = await getUserOrders();

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Get status label based on language
  const getStatusLabel = (status: string) => {
    if (isArabic) {
      switch (status) {
        case 'pending': return 'قيد الانتظار';
        case 'processing': return 'قيد المعالجة';
        case 'shipped': return 'تم الشحن';
        case 'delivered': return 'تم التسليم';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="head-12 text-center my-4">
        { isArabic ? 'طلباتي' : 'My Orders' }
      </h1>

      { orders.length > 0 ? (
        <div className="space-y-6">
          { orders.map((order: any) => (
            <div key={ order._id } className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              {/* Order Header */ }
              <div className="p-4 border-b dark:border-gray-700 flex flex-wrap justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    { isArabic ? 'رقم الطلب:' : 'Order #' } { order._id }
                  </div>
                  <div className="text-sm dark:text-white">
                    { isArabic ? 'تاريخ الطلب:' : 'Placed on' } { formatDate(order.createdAt) }
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={ `px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}` }>
                    { getStatusLabel(order.status) }
                  </span>

                  <Link
                    href={ `/${lang}/orders/${order._id}` }
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    { isArabic ? 'عرض التفاصيل' : 'View Details' }
                  </Link>
                </div>
              </div>

              {/* Order Items */ }
              <div className="p-4">
                <div className="space-y-4">
                  { order.items.slice(0, 2).map((item: any) => (
                    <div key={ item._id } className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                        <Image
                          src={ item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}` }
                          alt={ isArabic ? item.product.nameAr : item.product.name }
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-grow">
                        <h3 className="text-sm font-medium dark:text-primary-10 text-primary">
                          { isArabic ? item.product.nameAr : item.product.name }
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                          <span>
                            { isArabic ? 'الكمية:' : 'Qty:' } { item.quantity } x ${ item.price.toFixed(2) }
                          </span>
                          <span className='text-black dark:text-white'>
                            ${ (item.quantity * item.price).toFixed(2) }
                          </span>
                        </p>
                      </div>
                    </div>
                  )) }

                  { order.items.length > 2 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      { isArabic
                        ? `+ ${order.items.length - 2} منتجات أخرى`
                        : `+ ${order.items.length - 2} more items` }
                    </div>
                  ) }
                </div>

                <div className="mt-4 text-right">
                  <div className="text-lg font-bold dark:text-white">
                    { isArabic ? 'المجموع:' : 'Total:' } ${ order.totalPrice.toFixed(2) }
                  </div>
                </div>
              </div>
            </div>
          )) }
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-medium mb-4 dark:text-white">
            { isArabic ? 'لا توجد طلبات' : 'No Orders Yet' }
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            { isArabic
              ? 'لم تقم بإنشاء أي طلبات بعد.'
              : 'You haven\'t placed any orders yet.' }
          </p>
          <Link
            href={ `/${lang}/products` }
            className="inline-block py-3 px-8 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            { isArabic ? 'تصفح المنتجات' : 'Browse Products' }
          </Link>
        </div>
      ) }
    </div>
  );
}