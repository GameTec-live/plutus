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
        <div className="grid grid-cols-[200px_1fr] gap-6 items-start">
            <SettingsSidebar name={name} image={image} />
            <SettingsForm name={name} email={email} image={image} />
        </div>
    );
}
