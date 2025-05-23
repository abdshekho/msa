"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "flowbite-react";

export default function Profile({ params }: { params: { lang: string } }) {
  const { data: session, update } = useSession();

  

  const [name, setName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState(session?.user?.phone || "");
  const [address, setAddress] = useState(session?.user?.address || "");
  const [image, setImage] = useState(session?.user?.image || "/en/profile.webp");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // تحديث الحقول عندما تكون بيانات الجلسة متاحة
  // useEffect(() => {
  //   if (session?.user) {
  //     setName(session.user.name || "");
  //     setPhone(session.user.phone || "");
  //     setAddress(session.user.address || "");
  //     setImage(session.user.image || "/en/profile.webp");
  //   }
  // }, [session]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const userData = await response.json();

          

          setName(userData.name || "");
          setPhone(userData.phone || "");
          setAddress(userData.address || "");
          setImage(userData.image || "/en/profile.webp");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);
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
        setMessage({ text: error || "222حدث خطأ أثناء تحديث البيانات", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

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
        body: JSON.stringify({ name, phone, address, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || "000حدث خطأ أثناء تحديث البيانات", type: "error" });
        setIsLoading(false);
        return;
      }

      // تحديث بيانات الجلسة
      await update({
        user: {
          name,
          image,
          phone,
          address
        }
      });


      setMessage({ text: "تم تحديث البيانات بنجاح", type: "success" });
    } catch (error) {
      setMessage({ text: "1111حدث خطأ أثناء تحديث البيانات", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage({ text: "", type: "" });

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: "كلمات المرور الجديدة غير متطابقة", type: "error" });
      setIsChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ text: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل", type: "error" });
      setIsChangingPassword(false);

      
      return;
    }
    const email = session?.user?.email;

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ text: data.message || "حدث خطأ أثناء تغيير كلمة المرور", type: "error" });
        return;
      }

      setPasswordMessage({ text: "تم تغيير كلمة المرور بنجاح", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({ text: "حدث خطأ أثناء تغيير كلمة المرور", type: "error" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">الملف الشخصي</h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        { message.text && (
          <div
            className={ `mb-4 p-4 rounded ${message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
              }` }
          >
            { message.text }
          </div>
        ) }

        <form onSubmit={ handleSubmit } className="space-y-6">
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
            <Tooltip content='Edit profile image'>
              <label className="cursor-pointer" htmlFor="profile-image"><FaEdit /></label>
            </Tooltip>

          </div>

          <div>

            {/* <label className="block mb-2 font-medium" htmlFor="profile-image">Cover Image</label> */ }
            <input
              type="file"
              name="image"
              id="profile-image"
              onChange={ handleFileChange }
              className="w-full p-2 border rounded hidden"
              accept="image/*"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={ session?.user?.email || "" }
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
              value={ name }
              onChange={ (e) => setName(e.target.value) }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم الهاتف
            </label>
            <input
              type="tel"
              id="phone"
              value={ phone }
              onChange={ (e) => setPhone(e.target.value) }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="رقم الهاتف"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              العنوان
            </label>
            <input
              type="text"
              id="address"
              value={ address }
              onChange={ (e) => setAddress(e.target.value) }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="العنوان"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="fButton"
            >
              { isLoading ? "جاري الحفظ..." : "حفظ التغييرات" }
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">تغيير كلمة المرور</h2>

        { passwordMessage.text && (
          <div
            className={ `mb-4 p-4 rounded ${passwordMessage.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
              }` }
          >
            { passwordMessage.text }
          </div>
        ) }

        <form onSubmit={ handlePasswordChange } className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              id="currentPassword"
              value={ currentPassword }
              onChange={ (e) => setCurrentPassword(e.target.value) }
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              id="newPassword"
              value={ newPassword }
              onChange={ (e) => setNewPassword(e.target.value) }
              required
              minLength={ 6 }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تأكيد كلمة المرور الجديدة
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={ confirmPassword }
              onChange={ (e) => setConfirmPassword(e.target.value) }
              required
              minLength={ 6 }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={ isChangingPassword }
            className="fButton"
          >
            { isChangingPassword ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور" }
          </button>
        </form>
      </div>
    </div>
  );
}