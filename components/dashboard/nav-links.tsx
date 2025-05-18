'use client';
// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
// } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBeer, FaHome, FaCogs } from 'react-icons/fa';
// import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: FaHome },
  {
    name: 'products',
    href: '/dashboard/products',
    icon: FaBeer,
  },
  { name: 'categories', href: '/dashboard/categories', icon: FaBeer },
  { name: 'brands', href: '/dashboard/brands', icon: FaBeer },
  { name: 'services', href: '/dashboard/services', icon: FaCogs },
];

export default function NavLinks() {
  const pathname = usePathname();

  console.log('🚀 ~ nav-links.tsx ~ NavLinks ~ pathname:', pathname);

  return (
    <>
      { links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={ link.name }
            href={ link.href }
            // className={clsx(
            //   'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            //   {
            //     'bg-sky-100 text-blue-600': pathname === link.href,
            //   },
            // )}     
            className={ `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3${pathname === "/en"+link.href ? 'bg-sky-100 text-blue-600' : null}` }
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{ link.name }</p>
          </Link>
        );
      }) }
    </>
  );
}
