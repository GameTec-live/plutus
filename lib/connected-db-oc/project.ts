import { cacheLife, cacheTag } from "next/cache";
import { getAllProjects as getDbAllProjects } from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

type DbProject = Awaited<ReturnType<typeof getDbAllProjects>>[number];

async function getProjectWithBalance(project: DbProject) {
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
export type ProjectPromiseEntry = {
    id: string;
    projectPromise: Promise<Project>;
};
export type projects = ProjectPromiseEntry[];

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
