'use client';
// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaBoxOpen,
  FaTags,
  FaIndustry,
  FaTools,
  FaShoppingCart,
  FaUsers,
} from 'react-icons/fa';

// import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: FaHome ,nameAr:'الصفحة الرئيسية'},
  { name: 'products', href: '/dashboard/products', icon: FaBoxOpen ,nameAr:'المنتجات'},
  { name: 'categories', href: '/dashboard/categories', icon: FaTags ,nameAr:'التصنيفات'},
  { name: 'brands', href: '/dashboard/brands', icon: FaIndustry ,nameAr:'العلامات التجارية'},
  { name: 'services', href: '/dashboard/services', icon: FaTools ,nameAr:'الخدمات'},
  { name: 'orders', href: '/dashboard/orders', icon: FaShoppingCart ,nameAr:'الطلبات'},
  { name: 'users', href: '/dashboard/users', icon: FaUsers ,nameAr:'المستخدمين'},
];

export default function NavLinks({lang}) {
  const pathname = usePathname();

  // console.log('🚀 ~ nav-links.tsx ~ NavLinks ~ pathname:', pathname);

  return (
    <>
      { links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={ link.name }
            href={ `/${lang}${link.href}` }    
            className={ `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-[#1f2937]
                p-3 text-sm font-medium hover:opacity-75  md:flex-none md:justify-start md:p-2 
                md:px-3 ${pathname === "/" + lang + link.href ? ' bg-primary dark:bg-primary text-white' : null}` }>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{  lang === 'en' ? link.name : link.nameAr }</p>
          </Link>
        );
      }) }
    </>
  );
}
