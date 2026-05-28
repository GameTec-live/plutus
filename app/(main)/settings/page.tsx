import { Suspense } from "react";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata = {
    title: "User Settings – Plutus",
};

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
