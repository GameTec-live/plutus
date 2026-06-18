import { getAllProjects as getDbAllProjects } from "@/lib/db/queries/project";
import { getProjectBalanceByProjectId } from "@/lib/oc/queries/project";

export async function GetAllProjects() {
    const dbProjects = await getDbAllProjects();

    const projectsWithBalance = await Promise.all(
        dbProjects.map(async (project) => {
            const balanceResult = await getProjectBalanceByProjectId(
                project.openCollectiveID ?? "",
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

export type GetAllProjects = Awaited<ReturnType<typeof GetAllProjects>>;
export type Project = GetAllProjects[number];
