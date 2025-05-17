"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function SignUp({ params }: { params: { lang: string } }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("/en/profile.webp");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // For cover image
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create a FormData object
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'porfiles');

      try {
        setIsLoading(true);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Image upload failed');

        const data = await response.json();

        setImage(data?.imageUrl);



        // setProduct(prev => ({ ...prev, imageCover: data.imageUrl }));
      } catch (error: any) {
        console.error('Error uploading image:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", {
        callbackUrl: `/${resolvedParams.lang}`,
      });
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول بواسطة جوجل");
      setIsGoogleLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, address, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "حدث خطأ أثناء التسجيل");
        setIsLoading(false);
        return;
      }

      router.push(`/${resolvedParams.lang}/auth/signin`);
    } catch (error) {
      setError("حدث خطأ أثناء التسجيل");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            إنشاء حساب جديد
          </h2>
        </div>
        { error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{ error }</span>
          </div>
        ) }

        <div className="mt-6">
          <button
            onClick={ handleGoogleSignIn }
            disabled={ isGoogleLoading }
            className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="h-5 w-5" />
            { isGoogleLoading ? "جاري التحميل..." : "تسجيل الدخول باستخدام جوجل" }
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو تسجيل الدخول باستخدام البريد الإلكتروني</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={ handleSubmit }>
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={ image || '/en/profile.webp' }
                alt={ name || "صورة المستخدم" }
                width={ 96 }
                height={ 96 }
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                الاسم
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="الاسم"
                value={ name }
                onChange={ (e) => setName(e.target.value) }
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="البريد الإلكتروني"
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="كلمة المرور"
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="رقم الهاتف"
                value={ phone }
                onChange={ (e) => setPhone(e.target.value) }
              />
            </div>
            <div>
              <label htmlFor="address" className="sr-only">
                العنوان
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="العنوان"
                value={ address }
                onChange={ (e) => setAddress(e.target.value) }
              />
            </div>
            <div>
              {/* <label htmlFor="image" className="sr-only">
                رابط الصورة الشخصية
              </label>
              <input
                id="image"
                name="image"
                type="text"
                className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="رابط الصورة الشخصية (اختياري)"
                value={ image }
                onChange={ (e) => setImage(e.target.value) }
              /> */}
              <label className="block mb-2 font-medium" htmlFor="profile-image">Cover Image</label>
              <input
                type="file"
                name="image"
                id="profile-image"
                onChange={ handleFileChange }
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={ `/${resolvedParams.lang}/auth/signin` } className="font-medium text-indigo-600 hover:text-indigo-500">
                لديك حساب بالفعل؟ سجل دخول
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
            >
              { isLoading ? "جاري التسجيل..." : "إنشاء حساب" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}