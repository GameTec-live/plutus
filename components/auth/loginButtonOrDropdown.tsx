"use client";
import { DisclosureButton } from "@headlessui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function LoginButtonOrDropdown() {
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
            <div className="space-y-1 pt-2 pb-3">
                <DisclosureButton
                    as={Link}
                    href="/login"
                    className="inline-flex items-center py-2 pr-4 pl-3 text-base font-medium text-accent-foreground"
                >
                    Login <ArrowRight className="ml-1 size-4" />
                </DisclosureButton>
            </div>
        );
    }

    return (
        <div className="border-t border-border pt-4 pb-3">
            <Link className="flex items-center px-4" href="/profile">
                <div className="shrink-0">
                    <Avatar className="size-10 rounded-full bg-muted outline -outline-offset-1 outline-border">
                        <AvatarImage
                            src={session.user.image || undefined}
                            alt={session.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                            {session.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="ml-3">
                    <div className="text-base font-medium text-foreground">
                        {session.user.name}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                        {session.user.email}
                    </div>
                </div>
            </Link>
            <div className="mt-3 space-y-1">
                <DisclosureButton
                    as={Link}
                    href="/dashboard"
                    className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    Dashboard
                </DisclosureButton>
                <DisclosureButton
                    as={Link}
                    href="/settings"
                    className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    Settings
                </DisclosureButton>
                <DisclosureButton
                    onClick={signOut}
                    className="block px-4 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    Sign out
                </DisclosureButton>
            </div>
        </div>
    );
}
