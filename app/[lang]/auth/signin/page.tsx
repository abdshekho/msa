"use client";

import { use, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FloatingLabel } from "flowbite-react";
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

export default function SignIn({ params }: { params: { lang: string } }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
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
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 py-8 px-8 bg-white dark:bg-card rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center head-1">
            تسجيل الدخول
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
            { isGoogleLoading ? "جاري التحميل..." : "تسجيل الدخول باستخدام جوجل" }
          </button>
        </div>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary dark:border-secondary-10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-card text-secondary dark:text-secondary-10">أو تسجيل الدخول باستخدام البريد الإلكتروني</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={ handleSubmit }>
          <div className="flex flex-col gap-2 md:gap-4">

            <FloatingLabel variant="outlined" label="Email" type="email" theme={ customTheme }
              autoComplete="email" value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              required 
              />
            <FloatingLabel variant="outlined" label="Password" type="password" theme={ customTheme }
              autoComplete="email" value={ password }
              onChange={ (e) => setPassword(e.target.value) }
              required />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={ `/${resolvedParams.lang}/auth/signup` } className="font-medium dark:text-secondary-10 hover:dark:text-secondary hover:underline">
                ليس لديك حساب؟ سجل الآن
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={ isLoading }
              className="w-full text-white bg-primary hover:bg-primary-10 focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-2 sm:px-4 py-2
                            dark:bg-primary dark:hover:bg-primary-10 focus:outline-none dark:focus:ring-primary-10"
            >
              { isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول" }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}