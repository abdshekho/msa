import { type Locale, i18n } from '@/i18n-config';
import "./globals.css";
// import { Inter } from 'next/font/google';
import { ThemeModeScript } from 'flowbite-react';
import { getDictionary } from '@/get-dictionary';
import NavbarMain from '@/components/Navigation/Navbar';
import AuthProvider from '@/components/auth/AuthProvider';
import ThemeProvider from "../them/theme-provider";
import { FooterMSA } from '../../components/ui/Footer';
import Providers from '@/components/ProgressProvider';
import { CartProvider } from '../lib/cart/CartContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { almarai } from '../ui/fonts'


// const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;
  const dictionary = await getDictionary(params.lang);
  return (
    <html lang={ params.lang } suppressHydrationWarning dir={ params.lang === 'ar' ? 'rtl' : 'ltr' }>
      <head>
        <ThemeModeScript />
      </head>
      <body className={ `min-h-screen  bg-white dark:bg-gray-900 ${almarai.className}` }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CategoryProvider>
              <CartProvider>
                <NavbarMain lang={ params.lang } dictionary={ dictionary } />
                <div className="min-h-screen bg-white dark:bg-gray-900">
                  <Providers>
                    { children }
                  </Providers>
                </div>
                <FooterMSA lang={params.lang}  dictionary={ dictionary } />
              </CartProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}