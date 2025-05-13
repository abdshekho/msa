// import { useParams  } from "next/navigation";
import { i18n, type Locale } from "../../i18n-config";
import "./globals.css";
import { ThemeModeScript } from 'flowbite-react';
import NavbarMain from "@/components/Navigation/Navbar";
import ThemeProvider from "../them/theme-provider";
export const metadata = {
  title: "i18n within app router - Vercel Examples",
  description: "How to do i18n in Next.js 15 within app router",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  // const router = useParams();

  // console.log('🚀 ~ layout.tsx ~ router:', router);

  // const { pathname } = router
  // // Define paths where the Navbar should NOT be shown
  // const noNavPaths = ['/dashboard', '/admin']; // Add any other paths like /admin if needed
  // // Check if the current path starts with any of the noNavPaths
  // const showNavbar = !noNavPaths.some(path => pathname.startsWith(path));

  const params = await props.params;
  const { children } = props;

  return (
    <html lang={ params.lang } suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarMain />
          {/* { showNavbar && <Navbar /> } */ }
          { children }
        </ThemeProvider>
      </body>
    </html>
  );
}