import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/navbar";
import { CreateProjectWizard } from "@/components/project/create-project-wizard";
import { auth } from "@/lib/auth";
import { getConfiguredCollectiveCurrency } from "@/lib/oc/queries/project";
import { normalizeCurrency } from "@/lib/project-goals";

async function CreateProjectPageContent() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login");

    let currency = "EUR";
    try {
        currency = normalizeCurrency(await getConfiguredCollectiveCurrency());
    } catch (error) {
        console.error("Failed to load collective currency", error);
    }

    return (
        <CreateProjectWizard
            projectId={crypto.randomUUID()}
            currency={currency}
        />
    );
}

export default function CreateProjectPage() {
    return (
        <>
            <Navbar />
            <Suspense
                fallback={
                    <main className="min-h-[calc(100dvh-4rem)] animate-pulse bg-muted/20" />
                }
            >
                <CreateProjectPageContent />
            </Suspense>
        </>
    );
}
