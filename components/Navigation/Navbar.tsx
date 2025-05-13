'use client'
import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import Image from "next/image";
import NavMenu from "../menuNav/NavMenu";
import Link from "next/link";
import LocaleSwitcher from "../locale-switcher";
import ThemeToggle from "@/app/them/theme-toggle";
import { useSession, signOut } from "next-auth/react";

export default function NavbarMain({ lang }: any) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const handleSignOut = () => {
        signOut({ callbackUrl: `/${lang}` });
    };

    return (
        <Navbar>
            <NavbarBrand href={ `/${lang}` }>
                <Image src="/favicon.ico" width={ 40 } height={ 45 } className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MSA sunPower</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                {isLoading ? (
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : isAuthenticated ? (
                    <Dropdown
                        arrowIcon={ false }
                        inline
                        label={
                            <Avatar 
                                alt={session?.user?.name || "User"} 
                                img={session?.user?.image  || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
                                rounded 
                                className="mx-2" 
                            />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm">{session?.user?.name}</span>
                            <span className="block truncate text-sm font-medium">{session?.user?.email}</span>
                        </DropdownHeader>
                        <DropdownItem className="dark:text-[#ffffffcf]">
                            <Link href={`/${lang}/dashboard`}>لوحة التحكم</Link>
                        </DropdownItem>
                        <DropdownItem>
                            <Link href={`/${lang}/profile`}>الإعدادات</Link>
                        </DropdownItem>
                        {session?.user?.role === "admin" && (
                            <DropdownItem>
                                <Link href={`/${lang}/admin`}>إدارة الموقع</Link>
                            </DropdownItem>
                        )}
                        <DropdownDivider />
                        <DropdownItem onClick={handleSignOut}>تسجيل الخروج</DropdownItem>
                    </Dropdown>
                ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Link 
                            href={`/${lang}/auth/signin`}
                            className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline mx-2"
                        >
                            تسجيل الدخول
                        </Link>
                        <Link 
                            href={`/${lang}/auth/signup`}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            إنشاء حساب
                        </Link>
                    </div>
                )}
                <ThemeToggle />
                <LocaleSwitcher />
                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <NavbarLink>
                    <NavMenu />
                </NavbarLink>
                <Link href={ `/${lang}` }>
                    Home
                </Link>
                <Link href={ `/${lang}/categories` }>Categories</Link>
                <Link href={ `/${lang}/brands` }>Brands</Link>
                <Link href="#">Services</Link>
                <Link href="#">Contact</Link>
            </NavbarCollapse>
        </Navbar >
    );
}