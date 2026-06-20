import { cacheLife, cacheTag } from "next/cache";
import {
    type Project as DBProject,
    getAllProjects as getDbAllProjects,
} from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

async function getProjectWithBalance(project: DBProject) {
    if (!project.openCollectiveID) {
        return { ...project, balance: 0, currency: "€" };
    }

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
    cacheTag("project-listing");

    const dbProjects = await getDbAllProjects();

    return dbProjects.map((project) => ({
        id: project.id,
        projectPromise: getProjectWithBalance(project),
    }));
}

export type projects = Awaited<ReturnType<typeof GetAllProjects>>;
export type ProjectPromiseEntry = projects[number];
