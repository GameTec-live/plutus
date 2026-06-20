import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { getAllProjectByUserId } from "@/lib/connected-db-oc/project";
import { ProjectCardGrid } from "./projectCardGrid";

export default async function UserProjectsCardGrid({
    userid,
}: {
    userid: string;
}) {
    "use cache";
    cacheLife("minutes");
    cacheTag(cacheTags.projects.all, cacheTags.projects.byUser(userid));

    const projects = await getAllProjectByUserId(userid);

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center my-10">
                <p className="text-lg text-muted-foreground">
                    This user hasn&apos;t created any projects yet.
                </p>
            </div>
        );
    }

    return <ProjectCardGrid projects={projects} />;
}
