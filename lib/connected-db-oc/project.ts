import { cacheLife, cacheTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import {
    type Project as DBProject,
    getAllProjectByUserId as getDbAllProjectByUserId,
    getAllProjects as getDbAllProjects,
} from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

export async function getProjectWithBalance(project: DBProject) {
    "use cache";
    cacheLife("hours");
    cacheTag(cacheTags.projects.all, cacheTags.projects.byId(project.id));

    if (!project.openCollectiveID) {
        return { ...project, balance: 0, currency: "€" };
    }

    cacheTag(cacheTags.openCollective.projectBalance(project.openCollectiveID));

    const balanceResult = await getProjectBalanceByProjectId(
        project.openCollectiveID,
    );
    const balance = balanceResult.data?.project?.stats?.balance?.value ?? 0;
    const currency =
        balanceResult.data?.project?.stats?.balance?.currency ?? "€";

    return {
        ...project,
        balance,
        currency,
    };
}

export type Project = Awaited<ReturnType<typeof getProjectWithBalance>>;

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
