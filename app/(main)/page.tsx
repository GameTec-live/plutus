import { Suspense } from "react";
import Hero from "@/components/hero";
import AllProjectsCardGrid from "@/components/project/allProjectsCardGrid";
import ProjectLoadingPage from "@/components/project/projectloadingPage";

export default function Page() {
    return (
        <>
            <Hero />
            <Suspense fallback={<ProjectLoadingPage />}>
                <AllProjectsCardGrid id="explore" />
            </Suspense>
        </>
    );
}
