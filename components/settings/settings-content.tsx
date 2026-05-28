import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SettingsForm } from "./settings-form";
import { SettingsSidebar } from "./settings-sidebar";

export async function SettingsContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { name, email, image } = session.user;

    return (
        <div className="flex gap-6 items-start">
            {/* Sidebar: hidden on mobile, shown on lg+ */}
            <div className="hidden lg:block w-52 shrink-0">
                <SettingsSidebar name={name} image={image} />
            </div>
            {/* Form: full width on mobile, fills remaining space on lg+ */}
            <div className="flex-1 min-w-0">
                <SettingsForm name={name} email={email} image={image} />
            </div>
        </div>
    );
}
