"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function LoginButtonOrAvatar() {
    const { data: session, isPending, error } = authClient.useSession();
    const router = useRouter();

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    }

    if (isPending || error || !session) {
        return (
            <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-foreground"
            >
                Login <ArrowRight className="ml-1 size-4" />
            </Link>
        );
    }

    return (
        <Menu as="div" className="relative ml-4 shrink-0">
            <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Profile</span>
                <Avatar className="size-8 rounded-full bg-muted outline -outline-offset-1 outline-border">
                    <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name}
                    />
                    <AvatarFallback className="rounded-lg">
                        {session.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </MenuButton>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover py-1 text-popover-foreground shadow-lg outline-1 outline-border transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:shadow-none"
            >
                <MenuItem>
                    <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                    >
                        Dashboard
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                    >
                        Settings
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden"
                    >
                        Profile
                    </Link>
                </MenuItem>
                <MenuItem>
                    <button
                        onClick={signOut}
                        type="button"
                        className="block px-4 py-2 text-sm text-popover-foreground data-focus:bg-accent data-focus:text-accent-foreground data-focus:outline-hidden w-full text-left"
                    >
                        Sign out
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
}
