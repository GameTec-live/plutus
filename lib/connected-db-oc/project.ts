import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
    type Project as DBProject,
    getAllProjectByUserId as getDbAllProjectByUserId,
    getAllProjects as getDbAllProjects,
} from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

async function getCachedProjectBalance(
    projectId: string,
    openCollectiveID: string | null,
) {
    "use cache";
    cacheLife("hours");
    cacheTag(cacheTags.openCollective.projectBalance(projectId));

    if (!openCollectiveID) {
        return { balance: 0, currency: "EUR" };
    }

    try {
        const balanceResult = await getProjectBalanceByProjectId(
            openCollectiveID,
            projectId,
        );
        const balance = balanceResult.data?.project?.stats?.balance?.value;
        const currency =
            balanceResult.data?.project?.stats?.balance?.currency ?? "EUR";

        return {
            balance: balance ?? null,
            currency,
        };
    } catch (error) {
        console.error(
            `Failed to load Open Collective balance for project ${projectId}`,
            error,
        );
        return { balance: null, currency: "EUR" };
    }
}

export async function getProjectWithBalance<
    T extends { id: string; openCollectiveID: string | null },
>(project: T) {
    const balance = await getCachedProjectBalance(
        project.id,
        project.openCollectiveID,
    );
    return { ...project, ...balance };
}

export type Project = Awaited<
    ReturnType<typeof getProjectWithBalance<DBProject>>
>;

export async function GetAllProjects() {
    "use cache";
    cacheLife("days");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.projects.db,
        cacheTags.projects.list,
    );

    return getDbAllProjects();
}

export async function getAllProjectByUserId(userid: string) {
    "use cache";
    cacheLife("days");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.projects.db,
        cacheTags.projects.list,
        cacheTags.projects.byUser(userid),
    );

    return getDbAllProjectByUserId(userid);
}

export type projects = Awaited<ReturnType<typeof GetAllProjects>>;
export type ProjectPromiseEntry = projects[number];
