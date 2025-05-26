import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Order from '@/app/lib/models/Order';
import Link from 'next/link';

// Import User model to ensure it's registered
import '@/app/lib/models/User';

export default async function AdminOrdersPage({ params }: { params: { lang: string } }) {
  const {lang} = await params;
  const isArabic = lang === 'ar';
  
  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect(`/${lang}`);
  }
  
  // Fetch all orders
  await connectToDatabase();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name email')
    .populate({
      path: 'items.product',
      select: 'name nameAr price imageCover'
    });
  
  // Convert MongoDB documents to plain objects
  const serializedOrders = JSON.parse(JSON.stringify(orders));
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">
          {isArabic ? 'إدارة الطلبات' : 'Manage Orders'}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
                  {isArabic ? 'المجموع' : 'Total'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isArabic ? 'الحالة' : 'Status'}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isArabic ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {serializedOrders.map((order: any) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {order.user ? order.user.name : 'Unknown'}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {order.user ? order.user.email : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/${lang}/dashboard/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {isArabic ? 'عرض' : 'View'}
                    </Link>
                  </td>
                </tr>
              ))}
              
              {serializedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {isArabic ? 'لا توجد طلبات' : 'No orders found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}