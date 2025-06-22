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
import { BrandProvider } from '@/context/BrandContext';
import { almarai } from '../ui/fonts'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MSA',
    default: 'MSA',
  },
};

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
        <meta name="application-name" content="I18n App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="I18n App" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/FINAL.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        /> */}
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
              <BrandProvider>
                <CartProvider>
                  <NavbarMain lang={ params.lang } dictionary={ dictionary } />
                  <div className="min-h-screen bg-white dark:bg-gray-900">
                    <Providers>
                      { children }
                    </Providers>
                  </div>
                  <FooterMSA lang={params.lang}  dictionary={ dictionary } />
                </CartProvider>
              </BrandProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}