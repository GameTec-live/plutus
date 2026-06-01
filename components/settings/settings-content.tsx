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
            <div className="hidden lg:block w-52 shrink-0 sticky top-20 self-start">
                <SettingsSidebar name={name} image={image} />
            </div>
            <div className="flex-1 min-w-0">
                <SettingsForm name={name} email={email} image={image} />
            </div>
        </div>
    );
}
