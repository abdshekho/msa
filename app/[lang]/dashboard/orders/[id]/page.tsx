import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Order from '@/app/lib/models/Order';
import Link from 'next/link';
import Image from 'next/image';

// Import User model to ensure it's registered
import '@/app/lib/models/User';

export default async function AdminOrderDetailPage({ 
  params 
}: { 
  params: { id: string; lang: string } 
}) {
  const { id, lang } = await params;
  const isArabic = lang === 'ar';
  
  // Check if user is logged in and is admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect(`/${lang}`);
  }
  
  // Fetch order details
  await connectToDatabase();
  const order = await Order.findById(id)
    .populate('user', 'name email phone')
    .populate({
      path: 'items.product',
      select: 'name nameAr price imageCover'
    });
  
  if (!order) {
    notFound();
  }
  
  // Convert MongoDB document to plain object
  const serializedOrder = JSON.parse(JSON.stringify(order));
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
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
        <div>
          <Link 
            href={`/${lang}/dashboard/orders`}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mb-2 inline-block"
          >
            ← {isArabic ? 'العودة إلى الطلبات' : 'Back to Orders'}
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">
            {isArabic ? 'تفاصيل الطلب' : 'Order Details'} #{serializedOrder._id.substring(0, 8)}
          </h1>
        </div>
        
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(serializedOrder.status)}`}>
            {getStatusLabel(serializedOrder.status)}
          </span>
          
          <form action="/api/orders/update-status" method="POST" className="ml-4">
            <input type="hidden" name="orderId" value={serializedOrder._id} />
            <div className="flex items-center">
              <select 
                name="status" 
                defaultValue={serializedOrder.status}
                className="border border-gray-300 rounded px-3 py-1 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="pending">{isArabic ? 'قيد الانتظار' : 'Pending'}</option>
                <option value="processing">{isArabic ? 'قيد المعالجة' : 'Processing'}</option>
                <option value="shipped">{isArabic ? 'تم الشحن' : 'Shipped'}</option>
                <option value="delivered">{isArabic ? 'تم التسليم' : 'Delivered'}</option>
                <option value="cancelled">{isArabic ? 'ملغي' : 'Cancelled'}</option>
              </select>
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                {isArabic ? 'تحديث' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4 dark:text-white">
                {isArabic ? 'معلومات الطلب' : 'Order Information'}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'رقم الطلب:' : 'Order ID:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder._id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'تاريخ الطلب:' : 'Order Date:'}
                  </p>
                  <p className="dark:text-white">{formatDate(serializedOrder.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'العميل:' : 'Customer:'}
                  </p>
                  <p className="dark:text-white">
                    {serializedOrder.user ? serializedOrder.user.name : 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'البريد الإلكتروني:' : 'Email:'}
                  </p>
                  <p className="dark:text-white">
                    {serializedOrder.user ? serializedOrder.user.email : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">
                {isArabic ? 'المنتجات' : 'Products'}
              </h2>
              
              <div className="space-y-4">
                {serializedOrder.items.map((item: any) => (
                  <div key={item._id} className="flex items-center border-b pb-4 dark:border-gray-700">
                    <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                      {item.product && item.product.imageCover && (
                        <Image
                          src={item.product.imageCover.startsWith('/') ? item.product.imageCover : `/${item.product.imageCover}`}
                          alt={isArabic && item.product.nameAr ? item.product.nameAr : item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium dark:text-white">
                        {isArabic && item.product && item.product.nameAr ? item.product.nameAr : (item.product ? item.product.name : 'Unknown Product')}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isArabic ? 'الكمية:' : 'Qty:'} {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t dark:border-gray-700">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{isArabic ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span>${serializedOrder.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{isArabic ? 'الشحن:' : 'Shipping:'}</span>
                  <span>{isArabic ? 'مجاني' : 'Free'}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 dark:text-white">
                  <span>{isArabic ? 'المجموع:' : 'Total:'}</span>
                  <span>${serializedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Shipping Information */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4 dark:text-white">
                {isArabic ? 'معلومات الشحن' : 'Shipping Information'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'الاسم:' : 'Name:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'رقم الهاتف:' : 'Phone:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'العنوان:' : 'Address:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'المدينة:' : 'City:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.city}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'الرمز البريدي:' : 'Postal Code:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.postalCode}</p>
                </div>
                
                {/* <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {isArabic ? 'البلد:' : 'Country:'}
                  </p>
                  <p className="dark:text-white">{serializedOrder.shippingAddress.country}</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}