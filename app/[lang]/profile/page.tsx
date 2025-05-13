"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Profile({ params }: { params: { lang: string } }) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || "حدث خطأ أثناء تحديث البيانات", type: "error" });
        setIsLoading(false);
        return;
      }

      // تحديث بيانات الجلسة
      await update({ name });
      
      setMessage({ text: "تم تحديث البيانات بنجاح", type: "success" });
    } catch (error) {
      setMessage({ text: "حدث خطأ أثناء تحديث البيانات", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        {message.text && (
          <div 
            className={`mb-4 p-4 rounded ${
              message.type === "success" 
                ? "bg-green-100 text-green-700 border border-green-400" 
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={session?.user?.email || ""}
              disabled
              className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              لا يمكن تغيير البريد الإلكتروني
            </p>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">تغيير كلمة المرور</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          لتغيير كلمة المرور، يرجى إدخال كلمة المرور الحالية وكلمة المرور الجديدة.
        </p>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          تغيير كلمة المرور
        </button>
      </div>
    </div>
  );
}