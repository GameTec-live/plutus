import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SettingsForm } from "@/components/settings/settings-form";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { auth } from "@/lib/auth";

export const metadata = {
    title: "User Settings – Plutus",
};

async function SettingsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { name, email, image } = session.user;

    return (
        <div className="grid grid-cols-[200px_1fr] gap-6 items-start">
            <SettingsSidebar name={name} image={image} />
            <SettingsForm name={name} email={email} image={image} />
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-lg font-semibold text-foreground mb-6">
                User Settings
            </h1>
            <Suspense
                fallback={
                    <div className="text-sm text-muted-foreground">
                        Loading...
                    </div>
                }
            >
                <SettingsContent />
            </Suspense>
        </div>
    );
}
