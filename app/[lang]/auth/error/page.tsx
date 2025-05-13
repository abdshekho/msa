"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage({ params }: { params: { lang: string } }) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "حدث خطأ أثناء المصادقة";

  if (error === "CredentialsSignin") {
    errorMessage = "بيانات الاعتماد غير صحيحة";
  } else if (error === "AccessDenied") {
    errorMessage = "ليس لديك صلاحية للوصول إلى هذه الصفحة";
  } else if (error === "OAuthSignin" || error === "OAuthCallback") {
    errorMessage = "حدث خطأ أثناء المصادقة مع مزود الخدمة";
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "البريد الإلكتروني مستخدم بالفعل مع مزود مصادقة آخر";
  } else if (error === "EmailCreateAccount") {
    errorMessage = "حدث خطأ أثناء إنشاء الحساب";
  } else if (error === "Callback") {
    errorMessage = "حدث خطأ أثناء معالجة طلب المصادقة";
  } else if (error === "EmailSignin") {
    errorMessage = "حدث خطأ أثناء إرسال رابط تسجيل الدخول";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            خطأ في المصادقة
          </h2>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
        <div className="flex justify-center">
          <Link
            href={`/${params.lang}/auth/signin`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            العودة إلى صفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}