import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { auth } from "@/lib/auth";

export const metadata = {
    title: "User Settings - Plutus",
};

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const { name, email, image, bio } = session.user;
    const bannerImage = session.user.bannerImage ?? null;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-6 items-start">
                <div className="hidden lg:block w-52 shrink-0 sticky top-20 self-start">
                    <SettingsSidebar name={name} image={image} />
                </div>
                <div className="flex-1 min-w-0">
                    <SettingsForm
                        name={name}
                        email={email}
                        image={image}
                        bannerImage={bannerImage}
                        bio={bio}
                    />
                </div>
            </div>
        </div>
    );
}
