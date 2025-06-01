"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { FloatingLabel } from "flowbite-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import profileImage from "@/public/en/profile.webp"
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import { getClientDictionary } from "@/get-dictionary-client";

const customTheme = {
  input: {
    "default": {
      "outlined": {
        "sm": "peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-xs text-gray-900 focus:border-primary focus:outline-none focus:ring-0 dark:border-primary dark:text-white dark:focus:border-primary",
        "md": "peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-primary"
      },
    }
  },
  label: {
    "default": {
      outlined: {
        "sm": "bg-white dark:bg-card peer-focus:text-primary dark:text-gray-400 peer-focus:dark:text-primary",
        "md": "bg-white dark:bg-card peer-focus:text-primary dark:text-gray-400 peer-focus:dark:text-primary"
      },
    },
  }
};

// Define the validation schema
const signupSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().optional(),
  address: z.string().optional()
});

// Type for the form data
type SignupFormData = z.infer<typeof signupSchema>;

export default function SignUp({ params }: { params: { lang: string } }) {
  const resolvedParams = use(params);
  const dictionary = getClientDictionary(resolvedParams.lang);
  const router = useRouter();
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Setup react-hook-form with zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: ""
    }
  });

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

  const handleSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
          image
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message || "حدث خطأ أثناء التسجيل");
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
    <div className={ `flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isLoading ? 'animate-pulse' : ''}` }>
      <div className="w-full max-w-md space-y-8 py-8 px-8 bg-white dark:bg-card rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center head-1">
            { dictionary.page.signup.title }
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
            className="w-full flex justify-center items-center gap-2 bg-card-10 dark:bg-bgm rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FcGoogle className="h-5 w-5" />
            { isGoogleLoading ? dictionary.page.signup.googleLoading : dictionary.page.signup.google }
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary dark:border-secondary-10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white font-medium dark:bg-card text-secondary dark:text-secondary-10">{ dictionary.page.signup.orRegister }</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={ handleFormSubmit(handleSubmit) }>
          { isLoading ?
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
            :
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src={ image || profileImage }
                  alt="صورة المستخدم"
                  width={ 96 }
                  height={ 96 }
                  className="rounded-full object-cover"
                />
              </div>
              <Tooltip content={ image ? dictionary.page.signup.editImage : dictionary.page.signup.addImage }>
                <label className="cursor-pointer" htmlFor="profile-image"><FaEdit /></label>
              </Tooltip>
            </div> }

          <div className="flex flex-col gap-2 md:gap-4">
            <div>
              <FloatingLabel
                variant="outlined"
                label={ dictionary.page.signup.Name }
                type="text"
                theme={ customTheme }
                disabled={ isLoading }
                { ...register("name") }
              />
              { errors.name && (
                <p className="mt-1 text-sm text-red-600">{ errors.name.message }</p>
              ) }
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label={ dictionary.page.signup.Email }
                type="email"
                disabled={ isLoading }
                theme={ customTheme }
                autoComplete="email"
                { ...register("email") }
              />
              { errors.email && (
                <p className="mt-1 text-sm text-red-600">{ errors.email.message }</p>
              ) }
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label={ dictionary.page.signup.password }
                type="password"
                theme={ customTheme }
                disabled={ isLoading }
                autoComplete="new-password"
                { ...register("password") }
              />
              { errors.password && (
                <p className="mt-1 text-sm text-red-600">{ errors.password.message }</p>
              ) }
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label={ dictionary.page.signup.phonNumber }
                type="tel"
                disabled={ isLoading }
                theme={ customTheme }
                { ...register("phone") }
              />
              { errors.phone && (
                <p className="mt-1 text-sm text-red-600">{ errors.phone.message }</p>
              ) }
            </div>

            <div>
              <FloatingLabel
                variant="outlined"
                label={ dictionary.page.signup.Address }
                type="text"
                disabled={ isLoading }
                theme={ customTheme }
                { ...register("address") }
              />
              { errors.address && (
                <p className="mt-1 text-sm text-red-600">{ errors.address.message }</p>
              ) }
            </div>

            <div className="hidden">
              <label className="block mb-2 font-medium" htmlFor="profile-image">صورة الملف الشخصي</label>
              <input
                type="file"
                name="image"
                id="profile-image"
                disabled={ isLoading }
                onChange={ handleFileChange }
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={ `/${resolvedParams.lang}/auth/signin` } className="font-medium text-secondary dark:text-secondary-10 hover:text-secondary-10 dark:hover:text-secondary hover:underline">
                { dictionary.page.signup.signin }
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="fButton"
            >
              { isLoading ? dictionary.page.signup.submitLoading : dictionary.page.signup.submit }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}