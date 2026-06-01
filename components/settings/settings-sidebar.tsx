"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const navItems = [
    { label: "General", id: "general" },
    { label: "2FA", id: "2fa" },
];

function scrollTo(id: string) {
    if (id === "general") {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

export function SettingsSidebar({
    name,
    image,
}: {
    name: string;
    image?: string | null;
}) {
    const router = useRouter();
    const [activeId, setActiveId] = useState("general");

    useEffect(() => {
        function onScroll() {
            const twoFa = document.getElementById("2fa");
            if (!twoFa) return;
            // If the 2FA section top has crossed the middle of the viewport, mark it active
            const inView =
                twoFa.getBoundingClientRect().top < window.innerHeight / 2;
            setActiveId(inView ? "2fa" : "general");
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    async function handleSignOut() {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/") },
        });
    }

    return (
        <aside className="flex flex-col gap-5 bg-card ring-1 ring-foreground/10 rounded-xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollTo(item.id)}
                        className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            activeId === item.id
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <Separator />

            {/* Sign out */}
            <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full"
            >
                <LogOut className="size-4" />
                Sign out
            </button>
        </aside>
    );
}
