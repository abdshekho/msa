import Link from 'next/link';
// import AcmeLogo from '@/app/ui/acme-logo';
// import {  } from 'react-icons';
// import { signOut } from '@/auth';
import NavLinks from './nav-links';
import { FaBeer, FaCubes } from 'react-icons/fa';
import Image from "next/image";


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-[#1f2937] md:block"></div>
        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-[#1f2937] p-3 text-sm font-medium
            hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
          <FaBeer className="w-6" />
          <div className="hidden md:block ">Sign Out</div>
        </button>
      </div>
    </div>
  );
}
