"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import { profileSchema, passwordSchema, type ProfileFormData, type PasswordFormData } from "./schema";
import { z } from "zod";
import { getClientDictionary } from "../../../get-dictionary-client";

export default function Profile({ params }: { params: { lang: string } }) {
  const { data: session, update } = useSession();
  const resolvedParams = use(params);
  const dictionary = getClientDictionary(resolvedParams.lang as any);

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

        if (!response.ok) throw new Error(dictionary.page.profile.imageUploadFailed);

        const data = await response.json();

        setImage(data?.imageUrl);

      } catch (error: any) {
        console.error('Error uploading image:', error);
        setMessage({ text: error || dictionary.page.profile.updateError, type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  }, [dictionary.page.profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    setErrors({});

    try {
      // Validate form data with Zod
      const formData: ProfileFormData = { name, phone, address, image };
      profileSchema.parse(formData);

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, address, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ text: data.message || dictionary.page.profile.updateError, type: "error" });
        setIsLoading(false);
        return;
      }

      // Update session data
      await update({
        user: {
          name,
          image,
          phone,
          address
        }
      });

      setMessage({ text: dictionary.page.profile.updateSuccess, type: "success" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setErrors(errorMap);
        setMessage({ text: dictionary.page.profile.formErrors, type: "error" });
      } else {
        setMessage({ text: dictionary.page.profile.updateError, type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage({ text: "", type: "" });
    setPasswordErrors({});

    try {
      // Validate password data with Zod
      const passwordData: PasswordFormData = { currentPassword, newPassword, confirmPassword };
      passwordSchema.parse(passwordData);

      const email = session?.user?.email;

      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage({ text: data.message || dictionary.page.profile.passwordChangeError, type: "error" });
        return;
      }

      setPasswordMessage({ text: dictionary.page.profile.passwordChangeSuccess, type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errorMap[err.path[0]] = err.message;
          }
        });
        setPasswordErrors(errorMap);
        setPasswordMessage({ text: dictionary.page.profile.formErrors, type: "error" });
      } else {
        setPasswordMessage({ text: dictionary.page.profile.passwordChangeError, type: "error" });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">{ dictionary.page.profile.title }</h1>

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
          { isLoading || isChangingPassword ?
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
            :
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src={ image || '/en/profile.webp' }
                  alt={ name || dictionary.page.profile.userImage }
                  width={ 96 }
                  height={ 96 }
                  className="rounded-full object-cover"
                />
              </div>
              <Tooltip content={ dictionary.page.profile.editImage }>
                <label className="cursor-pointer" htmlFor="profile-image"><FaEdit /></label>
              </Tooltip>
            </div> }

          <div>
            <input
              type="file"
              name="image"
              id="profile-image"
              disabled={ isLoading || isChangingPassword }
              onChange={ handleFileChange }
              className="w-full p-2 border rounded hidden"
              accept="image/*"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.email }
            </label>
            <input
              type="email"
              id="email"
              value={ session?.user?.email || "" }
              disabled
              className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              { dictionary.page.profile.emailNotEditable }
            </p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.name }
            </label>
            <input
              type="text"
              id="name"
              value={ name }
              disabled={ isLoading || isChangingPassword }
              onChange={ (e) => setName(e.target.value) }
              className={ `w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white` }
            />
            { errors.name && <p className="mt-1 text-sm text-red-600">{ errors.name }</p> }
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.phone }
            </label>
            <input
              type="number"
              id="phone"
              value={ phone }
              disabled={ isLoading || isChangingPassword }
              onChange={ (e) => setPhone(e.target.value) }
              className={ `w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none` }
              placeholder={ dictionary.page.profile.phone }
            />
            { errors.phone && <p className="mt-1 text-sm text-red-600">{ errors.phone }</p> }
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.address }
            </label>
            <input
              type="text"
              id="address"
              disabled={ isLoading || isChangingPassword }
              value={ address }
              onChange={ (e) => setAddress(e.target.value) }
              className={ `w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white` }
              placeholder={ dictionary.page.profile.address }
            />
            { errors.address && <p className="mt-1 text-sm text-red-600">{ errors.address }</p> }
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="fButton"
            >
              { isLoading ? dictionary.page.profile.savingChanges : dictionary.page.profile.saveChanges }
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{ dictionary.page.profile.changePassword }</h2>

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
              { dictionary.page.profile.currentPassword }
            </label>
            <input
              type="password"
              id="currentPassword"
              disabled={ isChangingPassword || isLoading }
              value={ currentPassword }
              onChange={ (e) => setCurrentPassword(e.target.value) }
              className={ `w-full px-3 py-2 border ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white` }
            />
            { passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{ passwordErrors.currentPassword }</p> }
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.newPassword }
            </label>
            <input
              type="password"
              id="newPassword"
              disabled={ isChangingPassword || isLoading }
              value={ newPassword }
              onChange={ (e) => setNewPassword(e.target.value) }
              className={ `w-full px-3 py-2 border ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white` }
            />
            { passwordErrors.newPassword && <p className="mt-1 text-sm text-red-600">{ passwordErrors.newPassword }</p> }
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              { dictionary.page.profile.confirmPassword }
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={ confirmPassword }
              disabled={ isChangingPassword || isLoading }
              onChange={ (e) => setConfirmPassword(e.target.value) }
              className={ `w-full px-3 py-2 border ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white` }
            />
            { passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{ passwordErrors.confirmPassword }</p> }
          </div>

          <button
            type="submit"
            disabled={ isChangingPassword || isLoading }
            className="fButton"
          >
            { isChangingPassword ? dictionary.page.profile.changingPassword : dictionary.page.profile.changePasswordBtn }
          </button>
        </form>
      </div>
    </div>
  );
}