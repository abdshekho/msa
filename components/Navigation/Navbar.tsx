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
import { IoSettingsOutline } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { usePathname } from 'next/navigation';

export default function NavbarMain({ lang }: any) {
    const { data: session, status } = useSession();

    // console.log('🚀 ~ Navbar.tsx ~ NavbarMain ~ session:', session);

    const pathname = usePathname();

    // console.log('🚀 ~ Navbar.tsx ~ NavbarMain ~ pathname:', pathname === '/' + lang);
    // console.log( pathname);



    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const handleSignOut = () => {
        signOut({ callbackUrl: `/${lang}` });
    };

    return (
        <Navbar className={ `bg-white dark:bg-[#1F2937] ${pathname === '/' + lang ? 'absolute w-full z-10 bg-transparent dark:bg-transparent' : ''}` }>
            <NavbarBrand href={ `/${lang}` } className="hover:animate-pulse">
                <Image src="/favicon.ico" width={ 70 } height={ 100 } className="mr-1 h-9" alt="Flowbite React Logo" />
                <div className="hidden lg:flex flex-col  justify-center items-center self-center whitespace-nowrap text-lg font-semibold dark:text-white">
                    <span className="text-[#d28711] font-bold">MSA</span>
                    <span className="mt-[-10px] text-[#05406d] font-bold">SunPower</span>
                </div>
            </NavbarBrand>
            <div className="flex md:order-2">
                { isLoading ? (
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : isAuthenticated ? (
                    <Dropdown
                        arrowIcon={ false }
                        inline
                        label={
                            <Avatar
                                alt={ session?.user?.name || "User" }
                                img={ session?.user?.image || "/profile.webp" }
                                rounded
                                className="mx-2"
                            />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm text-center text-primary">{ session?.user?.name }</span>
                            <span className="block truncate text-sm font-medium text-secondary dark:text-secondary-10">{ session?.user?.email }</span>
                        </DropdownHeader>
                        <DropdownDivider />
                        { session?.user?.role === 'admin' &&
                            (<DropdownItem className="dark:text-[#ffffffcf]">
                                <Link href={ `/${lang}/dashboard` }>لوحة التحكم</Link>
                            </DropdownItem>) }

                        <Link href={ `/${lang}/profile` }>
                            <DropdownItem>
                                <BsFillPersonLinesFill className="mx-2" />
                                {/* الإعدادات */ }
                                setting
                            </DropdownItem >
                        </Link>
                        { session?.user?.role === "admin" && (
                            <Link href={ `/${lang}/dashboard` }>
                                <DropdownItem>
                                    <IoSettingsOutline className="mx-2" />
                                    Dashborad
                                </DropdownItem>
                            </Link>
                        ) }
                        <DropdownDivider />
                        <DropdownItem onClick={ handleSignOut }>
                            <VscSignOut className="mx-2" />
                            تسجيل الخروج
                        </DropdownItem>
                    </Dropdown>
                ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Link
                            href={ `/${lang}/auth/signin` }
                            className="text-sm font-medium text-primary dark:text-primary hover:underline hover:text-primary-10  mx-2"
                        >
                            تسجيل الدخول
                        </Link>
                        <Link
                            href={ `/${lang}/auth/signup` }
                            className="text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-2 sm:px-4 py-2
                             dark:bg-primary dark:hover:bg-primary-10 focus:outline-none dark:focus:ring-primary-10"
                        >
                            إنشاء حساب
                        </Link>
                    </div>
                ) }
                <ThemeToggle />
                <LocaleSwitcher />
                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <NavbarLink >
                    <NavMenu />
                </NavbarLink>
                <Link href={ `/${lang}` } className={ pathname === '/' + lang ? "active__link" : "menu__link" }>Home</Link>


                <Link href={ `/${lang}/categories` } className={ pathname.split('/')[2] === 'categories' ? "active__link" : "menu__link" }>Categories</Link>
                <Link href={ `/${lang}/brands` } className={ pathname.split('/')[2] === 'brands' ? "active__link" : "menu__link" }>Brands</Link>
                <Link href={ `/${lang}/services` } className={ pathname.split('/')[2] === 'services' ? "active__link" : "menu__link" }>Services</Link>
                <Link href="#" className={ `menu__link` }>Contact</Link>
            </NavbarCollapse>
        </Navbar >
    );
}