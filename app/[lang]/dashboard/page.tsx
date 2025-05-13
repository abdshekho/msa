"use client";

import { useSession } from "next-auth/react";

export default function Dashboard({ params }: { params: { lang: string } }) {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">مرحباً {session?.user?.name}!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          هذه هي لوحة التحكم الخاصة بك. يمكنك إدارة حسابك وعرض طلباتك من هنا.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">الطلبات</h3>
            <p className="text-gray-600 dark:text-gray-400">عرض وتتبع طلباتك</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">المفضلة</h3>
            <p className="text-gray-600 dark:text-gray-400">المنتجات المحفوظة في المفضلة</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">الإعدادات</h3>
            <p className="text-gray-600 dark:text-gray-400">تعديل معلومات الحساب</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">آخر النشاطات</h2>
        <div className="space-y-4">
          <div className="border-b dark:border-gray-700 pb-3">
            <p className="text-gray-600 dark:text-gray-300">لا توجد نشاطات حديثة</p>
          </div>
        </div>
      </div>
    </div>
  );
}