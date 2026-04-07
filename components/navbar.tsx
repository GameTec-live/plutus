"use client";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";

export default function Navbar() {
    return (
        <Disclosure
            as="nav"
            className="relative bg-background text-foreground shadow-sm dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-border"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex px-2 lg:px-0">
                        <div className="flex shrink-0 items-center">
                            <Image
                                alt="Plutus"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto dark:hidden"
                                width={32}
                                height={32}
                            />
                            <Image
                                alt="Plutus"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto not-dark:hidden"
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                            <Link
                                href="/#explore"
                                className="inline-flex items-center border-b-2 border-primary px-1 pt-1 text-sm font-medium text-foreground"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                            <input
                                name="search"
                                type="search"
                                placeholder="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-background py-1.5 pr-3 pl-10 text-base text-foreground outline-1 -outline-offset-1 outline-input placeholder:text-muted-foreground focus:outline-2 focus:-outline-offset-2 focus:outline-ring sm:text-sm/6"
                            />
                            <SearchIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-muted-foreground"
                            />
                        </div>
                    </div>
                    <ModeToggle />
                    <div className="flex items-center lg:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-2 focus:-outline-offset-1 focus:outline-ring">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <MenuIcon
                                aria-hidden="true"
                                className="block size-6 group-data-open:hidden"
                            />
                            <XIcon
                                aria-hidden="true"
                                className="hidden size-6 group-data-open:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="hidden lg:ml-4 lg:flex lg:items-center">
                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-4 shrink-0">
                            <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <Image
                                    alt=""
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    className="size-8 rounded-full bg-muted outline -outline-offset-1 outline-border"
                                    width={32}
                                    height={32}
                                />
                            </MenuButton>

                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover py-1 text-popover-foreground shadow-lg outline-1 outline-border transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:shadow-none"
                            >
                                <MenuItem>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                                    >
                                        Your profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                                    >
                                        Settings
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link
                                        href="#"
                                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                                    >
                                        Sign out
                                    </Link>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 pt-2 pb-3">
                    <DisclosureButton
                        as={Link}
                        href="/#explore"
                        className="block border-l-4 border-primary bg-accent py-2 pr-4 pl-3 text-base font-medium text-accent-foreground"
                    >
                        Explore
                    </DisclosureButton>
                </div>
                <div className="border-t border-border pt-4 pb-3">
                    <div className="flex items-center px-4">
                        <div className="shrink-0">
                            <Image
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-10 rounded-full bg-muted outline -outline-offset-1 outline-border"
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-foreground">
                                Tom Cook
                            </div>
                            <div className="text-sm font-medium text-muted-foreground">
                                tom@example.com
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1">
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Your profile
                        </DisclosureButton>
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Settings
                        </DisclosureButton>
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            Sign out
                        </DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
