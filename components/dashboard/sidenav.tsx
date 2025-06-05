'use client';
import Link from 'next/link';
// import AcmeLogo from '@/app/ui/acme-logo';
// import {  } from 'react-icons';
// import { signOut } from '@/auth';
import NavLinks from './nav-links';
import { FaBeer, FaCubes, FaSignOutAlt } from 'react-icons/fa';
import Image from "next/image";
import { signOut } from 'next-auth/react';


export default function SideNav({ lang }) {


  const handleSignOut = () => {
    signOut({ callbackUrl: `/${lang}` });
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row flex-wrap justify-between space-x-2 md:flex-col md:space-x-0 space-y-2">
        <NavLinks lang={lang}/>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-[#1f2937] md:block"></div>
        <button className="flex h-[48px] w-[48px] md:w-full items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-[#1f2937]
         p-3 text-sm font-medium hover:bg-sky-100 text-red-500 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={ handleSignOut }>
          <FaSignOutAlt className="w-6 text-red-500" />
          {/* <FaBeer className="w-6" /> */ }
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
}
