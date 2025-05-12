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
import { FaRegMoon } from "react-icons/fa";
import LocaleSwitcher from "../locale-switcher";

export default function NavbarMain() {
    return (
        <Navbar>
            <NavbarBrand href="https://flowbite-react.com">
                <Image src="/favicon.ico" width={ 40 } height={ 45 } className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">MSA sunPower</span>
            </NavbarBrand>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={ false }
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded className="mx-2" />
                    }
                >
                    <DropdownHeader>
                        <span className="block text-sm">Bonnie Green</span>
                        <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                    </DropdownHeader>
                    <DropdownItem>Dashboard</DropdownItem>
                    <DropdownItem>Settings</DropdownItem>
                    <DropdownItem>Earnings</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Sign out</DropdownItem>
                </Dropdown>
                <div className="flex justify-center items-center mx-2 bg-black rounded-full w-10 h-10">
                    <FaRegMoon className="size-6 text-blue-300" />
                </div>

                <LocaleSwitcher />
                <NavbarToggle />
            </div>

            <NavbarCollapse>
                <NavbarLink>      <NavMenu /> </NavbarLink>
                <Link href="/" >
                    Home
                </Link>
                <Link href="#">About</Link>
                <Link href="#">Services</Link>
                <Link href="#">Pricing</Link>
                <Link href="#">Contact</Link>
            </NavbarCollapse>
        </Navbar>
    );
}
