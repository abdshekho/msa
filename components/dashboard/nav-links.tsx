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
  { name: 'Home', href: '/dashboard', icon: FaHome },
  { name: 'products', href: '/dashboard/products', icon: FaBoxOpen },
  { name: 'categories', href: '/dashboard/categories', icon: FaTags },
  { name: 'brands', href: '/dashboard/brands', icon: FaIndustry },
  { name: 'services', href: '/dashboard/services', icon: FaTools },
  { name: 'orders', href: '/dashboard/orders', icon: FaShoppingCart },
  { name: 'users', href: '/dashboard/users', icon: FaUsers },
];

export default function NavLinks() {
  const pathname = usePathname();

  // console.log('🚀 ~ nav-links.tsx ~ NavLinks ~ pathname:', pathname);

  return (
    <>
      { links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={ link.name }
            href={ link.href }    
            className={ `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-[#1f2937]
                p-3 text-sm font-medium hover:opacity-75  md:flex-none md:justify-start md:p-2 
                md:px-3 ${pathname === "/en" + link.href ? ' bg-primary dark:bg-primary text-white' : null}` }>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{ link.name }</p>
          </Link>
        );
      }) }
    </>
  );
}
