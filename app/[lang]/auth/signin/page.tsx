"use client";

import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FloatingLabel } from "flowbite-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
});

// Type for the form data
type LoginFormData = z.infer<typeof loginSchema>;

export default function SignIn({ params }: { params: { lang: string } }) {
  const resolvedParams = use(params);
  const dictionary = getClientDictionary(resolvedParams.lang);

  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Setup react-hook-form with zod validation
  const { register, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("بيانات الاعتماد غير صحيحة");
        setIsLoading(false);
        return;
      }

      router.push(`/${resolvedParams.lang}`);
      router.refresh();
    } catch (error) {
      setError("حدث خطأ أثناء تسجيل الدخول");
      setIsLoading(false);
    }
  };

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

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${isLoading ? 'animate-pulse':''}`}>
      <div className="w-full max-w-md space-y-8 py-8 px-8 bg-white dark:bg-card rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center head-1">
            { dictionary.page.signin.title }
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
            className="w-full flex justify-center items-center gap-2  bg-card-10 dark:bg-bgm rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-white hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FcGoogle className="h-5 w-5" />

            { isGoogleLoading ? dictionary.page.signin.googleLoading : dictionary.page.signin.google }
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary dark:border-secondary-10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white font-medium dark:bg-card text-secondary dark:text-secondary-10">{ dictionary.page.signin.orRegister }</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={ handleFormSubmit(handleSubmit) }>
          <div className="flex flex-col gap-2 md:gap-4">
            <div>
              <FloatingLabel
                variant="outlined"
                label={dictionary.page.signin.Email}
                type="email"
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
                label={dictionary.page.signin.password}
                type="password"
                theme={ customTheme }
                autoComplete="current-password"
                { ...register("password") }
              />
              { errors.password && (
                <p className="mt-1 text-sm text-red-600">{ errors.password.message }</p>
              ) }
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={ `/${resolvedParams.lang}/auth/signup` } className="font-medium text-secondary  dark:text-secondary-10 hover:text-secondary-10 dark:hover:text-secondary hover:underline">
                { dictionary.page.signin.registerNow }
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="fButton"
            >
              { isLoading ? dictionary.page.signin.submitLoading : dictionary.page.signin.submit }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}