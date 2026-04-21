"use client";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import LoginButtonOrAvatar from "./auth/loginButtonOrAvatar";
import LoginButtonOrDropdown from "./auth/loginButtonOrDropdown";
import { ModeToggle } from "./modeToggle";

export default function Navbar() {
    return (
        <Disclosure
            as="nav"
            className="bg-background/50 backdrop-blur-md text-foreground shadow-sm dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-border sticky top-0 z-50"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex px-2 lg:px-0">
                        <Link className="flex shrink-0 items-center" href="/">
                            <Image
                                alt="Plutus"
                                loading="eager"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto dark:hidden"
                                width={32}
                                height={32}
                            />
                            <Image
                                alt="Plutus"
                                loading="eager"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                className="h-8 w-auto not-dark:hidden"
                                width={32}
                                height={32}
                            />
                        </Link>
                        <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                            <Link
                                href="/#explore"
                                className="inline-flex items-center border-b-2 border-primary px-1 pt-1 text-sm font-medium text-foreground"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6">
                        <div className="grid w-full grid-cols-1">
                            <input
                                name="search"
                                type="search"
                                aria-label="Search"
                                placeholder="Search"
                                className="col-start-1 row-start-1 block w-full rounded-md bg-background py-1.5 pr-3 pl-10 text-base text-foreground outline-1 -outline-offset-1 outline-input placeholder:text-muted-foreground focus:outline-2 focus:-outline-offset-2 focus:outline-ring sm:text-sm/6"
                            />
                            <SearchIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-muted-foreground"
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <ModeToggle />
                    </div>
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
                        <LoginButtonOrAvatar />
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
                <LoginButtonOrDropdown />
            </DisclosurePanel>
        </Disclosure>
    );
}
