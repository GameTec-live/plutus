"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const navItems = [
    { label: "General", href: "#general" },
    { label: "2FA", href: "#2fa" },
];

export function SettingsSidebar({
    name,
    image,
}: {
    name: string;
    image?: string | null;
}) {
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/") },
        });
    }

    return (
        <aside className="sticky top-20 flex flex-col justify-between bg-card ring-1 ring-foreground/10 rounded-xl p-4 min-h-64">
            <div className="space-y-5">
                {/* User info */}
                <div className="flex flex-col items-center gap-2 pt-2">
                    <Avatar className="size-14 ring-2 ring-border">
                        <AvatarImage src={image || undefined} alt={name} />
                        <AvatarFallback>
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-foreground text-center">
                        {name}
                    </span>
                </div>

                <Separator />

                {/* Nav */}
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors first:bg-accent first:text-accent-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Sign out */}
            <button
                type="button"
                onClick={handleSignOut}
                className="mt-6 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
            >
                <LogOut className="size-4" />
                Sign out
            </button>
        </aside>
    );
}
