import { cacheLife, cacheTag } from "next/cache";
import { getAllProjects as getDbAllProjects } from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

export async function GetAllProjects() {
    "use cache";
    cacheLife("days");
    cacheTag("project-listing");

    const dbProjects = await getDbAllProjects();

    const projectsWithBalance = await Promise.all(
        dbProjects.map(async (project) => {
            if (!project.openCollectiveID) {
                return { ...project, balance: 0, currency: "€" };
            }
            const balanceResult = await getProjectBalanceByProjectId(
                project.openCollectiveID,
            );
            const balance =
                balanceResult.data?.project?.stats?.balance?.value ?? 0;
            const currency =
                balanceResult.data?.project?.stats?.balance?.currency ?? "€";
            return {
                ...project,
                balance,
                currency,
            };
        }),
    );
    return projectsWithBalance;
}

export type projects = Awaited<ReturnType<typeof GetAllProjects>>;
export type Project = projects[number];
