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
import { usePathname } from 'next/navigation';
import CartDropdown from "../cart/CartDropdown";
import { FaClipboardList, FaCog, FaRegAddressCard, FaSignOutAlt, FaUserAlt, FaUserPlus } from "react-icons/fa";

const them = {
    "root": {
        "base": "bg-white px-2 py-2.5 sm:px-4 dark:border-gray-700 dark:bg-gray-800",
        "rounded": {
            "on": "rounded",
            "off": ""
        },
        "bordered": {
            "on": "border",
            "off": ""
        },
        "inner": {
            "base": "mx-auto flex flex-wrap items-center justify-between",
            "fluid": {
                "on": "",
                "off": "container"
            }
        }
    },
    "brand": {
        "base": "flex items-center"
    },
    "collapse": {
        "base": "w-full md:block md:w-auto dropDown_normal",
        "list": "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium",
        "hidden": {
            "on": "hidden ",
            "off": ""
        }
    },
    "link": {
        "base": "block py-2 pl-3 pr-4 md:p-0",
        "active": {
            "on": "bg-primary-700 text-white md:bg-transparent md:text-primary-700 dark:text-white",
            "off": "border-b border-gray-100 text-gray-700 hover:bg-gray-50 md:border-0 md:hover:bg-transparent md:hover:text-primary-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-white"
        },
        "disabled": {
            "on": "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
            "off": ""
        }
    },
    "toggle": {
        "base": "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600",
        "icon": "h-6 w-6 shrink-0",
        "title": "sr-only"
    }
}

const themd = {
    "content": "py-1 focus:outline-none dropDown_normal",
}
export default function NavbarMain({ lang, dictionary }: any) {
    const { data: session, status } = useSession();


    const pathname = usePathname();

    // console.log('🚀 ~ Navbar.tsx ~ NavbarMain ~ pathname:', pathname === '/' + lang);
    // console.log( pathname);



    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const handleSignOut = () => {
        signOut({ callbackUrl: `/${lang}` });
    };

    return (
        <Navbar style={ { direction: 'ltr' } } theme={ them }
            // className={ `bg-white dark:bg-[#1F2937] ${pathname === '/' + lang ? 'absolute w-full z-10 bg-transparent dark:bg-transparent' : ''}` }>
            className={ `bg-white dark:bg-[#1F2937]` }>
            {/* <Navbar className={ `bg-white bg-gradient-to-r dark:from-[#d2881134] via-10% dark:to-card ${pathname === '/' + lang ? 'absolute w-full z-10 bg-transparent dark:bg-transparent' : ''}` }> */ }
            <NavbarBrand href={ `/${lang}` } className="hover:animate-pulse" style={ { direction: "ltr" } }>
                {/* <NavbarBrand href={ `/${lang}` } className="hover:animate-pulse rounded-2xl bg-radial-[at_10%_75%] from-[#d2881121] via-[#d24e111e] to-[#1F2937] to-99%"> */ }
                <Image src="/favicon.ico" width={ 70 } height={ 100 } className="mr-1 h-9" alt="Flowbite React Logo" />
                <div className="hidden lg:flex flex-col  justify-center items-center self-center whitespace-nowrap text-lg font-semibold dark:text-white">
                    <span className="text-[#d28711] font-bold">MSA</span>
                    <span className="mt-[-10px] text-[#05406d] dark:text-[lightgray] font-bold">SunPower</span>
                </div>
            </NavbarBrand>
            <div className="flex md:order-2 gap-4">
                { session?.user?.role === 'user' && <CartDropdown /> }

                { isLoading ? (
                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : isAuthenticated && session?.user ? (
                    <Dropdown
                        arrowIcon={ false }
                        inline
                        theme={ themd }
                        label=
                        {
                            <Image src={ session?.user?.image || "/profile.webp" } alt={ "user" } width={ 40 } height={ 40 } className="rounded-full" />
                        }
                    // <Avatar
                    //     alt={ session?.user?.name || "User" }
                    //     img={session?.user?.image || "/profile.webp" }
                    //     rounded
                    //     className=""
                    // />
                    >
                        <DropdownHeader className="min-w-[200px]">
                            <span className="block text-sm text-center text-primary">{ session?.user?.name }</span>
                            <span className="block truncate text-center text-sm font-medium text-secondary dark:text-secondary-10">{ session?.user?.email }</span>
                        </DropdownHeader>
                        <DropdownDivider />
                        <Link href={ `/${lang}/profile` }>
                            <DropdownItem style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                                <FaRegAddressCard className="mx-2" />
                                {/* الإعدادات */ }
                                { lang === 'en' ? 'porfile' : 'الملف الشخصي' }
                                {/* setting */ }
                            </DropdownItem >
                            <DropdownDivider />
                        </Link>
                        { session?.user?.role === "admin" && (
                            <Link href={ `/${lang}/dashboard` }>
                                <DropdownItem style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                                    <FaCog className="mx-2" />
                                    { lang === 'en' ? 'Dashboard' : 'لوحة التحكم' }
                                </DropdownItem>
                                <DropdownDivider />
                            </Link>
                        ) }
                        { session?.user?.role === "user" && (
                            <Link href={ `/${lang}/orders` }>
                                <DropdownItem style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                                    <FaClipboardList className="mx-2" />
                                    { lang === 'en' ? 'My orders' : 'طلباتي' }
                                </DropdownItem>
                                <DropdownDivider />
                            </Link>
                        ) }
                        <DropdownItem onClick={ handleSignOut } style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                            <span className="flex items-center text-red-500 dark:text-red-400">
                                <FaSignOutAlt className="mx-2" />
                                { lang === 'en' ? 'Sign out' : 'تسجيل الخروج' }
                            </span>
                        </DropdownItem>
                    </Dropdown>
                ) : (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Link
                            href={ `/${lang}/auth/signin` }
                            className="flex items-center text-sm font-medium border-[1px] rounded-lg px-2 sm:px-4 py-2 border-primary text-primary dark:text-primary  hover:text-primary-10  focus:outline-none dark:focus:ring-primary-10 mx-2"
                        >
                            <FaUserAlt className="mx-1" />
                            { lang === 'en' ? 'Login' : 'تسجيل الدخول' }
                        </Link>
                        <Link
                            href={ `/${lang}/auth/signup` }
                            className="hidden md:flex items-center text-white bg-primary hover:bg-primary-10 focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm 
                            px-2 sm:px-4 py-2 dark:bg-primary dark:hover:bg-primary-10 focus:outline-none dark:focus:ring-primary-10"
                        >
                            <FaUserPlus className="mx-1" />
                            { lang === 'en' ? 'Signup' : 'إنشاء حساب' }
                        </Link>
                    </div>
                ) }

                <ThemeToggle />
                <LocaleSwitcher />
                <NavbarToggle />
            </div>
            <NavbarCollapse style={ { direction: lang === 'en' ? "ltr" : "rtl" } }>
                { lang === 'en' && < >
                    <NavMenu lang={ lang } />
                </> }
                <Link href={ `/${lang}` } className={ pathname === '/' + lang ? "active__link" : "menu__link" }>{ dictionary.navbar.home }</Link>
                <Link href={ `/${lang}/categories` } className={ pathname.split('/')[2] === 'categories' ? "active__link" : "menu__link" }>{ dictionary.navbar.categories }</Link>
                <Link href={ `/${lang}/brands` } className={ pathname.split('/')[2] === 'brands' ? "active__link" : "menu__link" }>{ dictionary.navbar.brands }</Link>
                <Link href={ `/${lang}/services` } className={ pathname.split('/')[2] === 'services' ? "active__link" : "menu__link" }>{ dictionary.navbar.services }</Link>
                <Link href={ `/${lang}/about` } className={ pathname.split('/')[2] === 'about' ? "active__link" : "menu__link" }>{ dictionary.navbar.about }</Link>
                <Link href={ `/${lang}/contact` } className={ pathname.split('/')[2] === 'contact' ? "active__link" : "menu__link" } style={ { border: 'none' } }>{ dictionary.navbar.contact }</Link>
                { lang === 'ar' && < >
                    <NavMenu lang={ lang } />
                </> }
            </NavbarCollapse>
        </Navbar >
    );
}