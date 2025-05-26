import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getOrderStatistics } from '@/app/lib/orders/admin-actions';
import Link from 'next/link';

// Import User model to ensure it's registered
import '@/app/lib/models/User';

export default async function DashboardPage({ params }: { params: { lang: string } }) {
  const resolved = await params;
  const lang = resolved.lang;
  const isArabic = lang === 'ar';
  
  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect(`/${lang}`);
  }
  
  // Get order statistics
  const { success, statistics, error } = await getOrderStatistics();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        {isArabic ? 'لوحة التحكم' : 'Dashboard'}
      </h1>
      
      {success && statistics ? (
        <>
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {isArabic ? 'قيد الانتظار' : 'Pending'}
              </h3>
              <p className="text-2xl font-bold dark:text-white">
                {statistics.pendingCount}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {isArabic ? 'قيد المعالجة' : 'Processing'}
              </h3>
              <p className="text-2xl font-bold dark:text-white">
                {statistics.processingCount}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {isArabic ? 'تم الشحن' : 'Shipped'}
              </h3>
              <p className="text-2xl font-bold dark:text-white">
                {statistics.shippedCount}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {isArabic ? 'تم التسليم' : 'Delivered'}
              </h3>
              <p className="text-2xl font-bold dark:text-white">
                {statistics.deliveredCount}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {isArabic ? 'ملغي' : 'Cancelled'}
              </h3>
              <p className="text-2xl font-bold dark:text-white">
                {statistics.cancelledCount}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">
                {isArabic ? 'إجمالي الإيرادات' : 'Total Revenue'}
              </h2>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${statistics.totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isArabic ? 'من الطلبات المكتملة' : 'From completed orders'}
              </p>
            </div>
            
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                <h2 className="text-lg font-bold dark:text-white">
                  {isArabic ? 'أحدث الطلبات' : 'Recent Orders'}
                </h2>
                <Link 
                  href={`/${lang}/dashboard/orders`}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  {isArabic ? 'عرض الكل' : 'View All'}
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {isArabic ? 'رقم الطلب' : 'Order ID'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {isArabic ? 'العميل' : 'Customer'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {isArabic ? 'التاريخ' : 'Date'}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {isArabic ? 'الحالة' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {statistics.recentOrders && statistics.recentOrders.map((order: any) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                          <Link 
                            href={`/${lang}/dashboard/orders/${order._id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            #{order._id.substring(0, 8)}...
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                          {order.user ? order.user.name : 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {(!statistics.recentOrders || statistics.recentOrders.length === 0) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          {isArabic ? 'لا توجد طلبات حديثة' : 'No recent orders'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || (isArabic ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data')}
        </div>
      )}
    </div>
  );
}