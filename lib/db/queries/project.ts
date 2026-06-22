import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib";
import { cacheTags } from "@/lib/cache-tags";
import { project, projectGoal, projectImage, user } from "../schema";

async function getGoalsByProjectIds(projectIds: string[]) {
    const rows =
        projectIds.length === 0
            ? []
            : await db
                  .select({
                      id: projectGoal.id,
                      projectId: projectGoal.projectId,
                      title: projectGoal.title,
                      description: projectGoal.description,
                      amount: projectGoal.amount,
                      isStretch: projectGoal.isStretch,
                      isPrimary: projectGoal.isPrimary,
                  })
                  .from(projectGoal)
                  .where(inArray(projectGoal.projectId, projectIds))
                  .orderBy(asc(projectGoal.amount), asc(projectGoal.createdAt));

    const byProject = new Map<
        string,
        Omit<(typeof rows)[number], "projectId">[]
    >();
    for (const row of rows) {
        const { projectId, ...goal } = row;
        const goals = byProject.get(projectId) ?? [];
        goals.push(goal);
        byProject.set(projectId, goals);
    }
    return byProject;
}

export async function getProjectById(id: string) {
    "use cache";
    cacheLife("days");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.projects.db,
        cacheTags.projects.byId(id),
        cacheTags.projects.image(id),
        cacheTags.projects.goals(id),
    );

    const [projectRows, images, goalsByProject] = await Promise.all([
        db
            .select({
                id: project.id,
                title: project.title,
                shortDescription: project.shortDescription,
                longDescription: project.longDescription,
                openCollectiveID: project.openCollectiveID,
                creator: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                },
            })
            .from(project)
            .innerJoin(user, eq(project.creator, user.id))
            .where(eq(project.id, id))
            .limit(1),
        db
            .select({
                id: projectImage.id,
                url: projectImage.url,
                isPrimary: projectImage.isPrimary,
            })
            .from(projectImage)
            .where(eq(projectImage.projectId, id))
            .orderBy(desc(projectImage.isPrimary), asc(projectImage.createdAt)),
        getGoalsByProjectIds([id]),
    ]);

    const projectData = projectRows[0];

    if (!projectData) {
        return undefined;
    }

    cacheTag(cacheTags.users.byId(projectData.creator.id));

    return { ...projectData, images, goals: goalsByProject.get(id) ?? [] };
}

export async function getAllProjects() {
    "use cache";
    cacheLife("days");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.projects.db,
        cacheTags.projects.list,
    );
    const projectData = await db
        .select({
            id: project.id,
            title: project.title,
            shortDescription: project.shortDescription,
            openCollectiveID: project.openCollectiveID,
            projectMainImage: projectImage.url,
        })
        .from(project)
        .leftJoin(
            projectImage,
            and(
                eq(project.id, projectImage.projectId),
                eq(projectImage.isPrimary, true),
            ),
        )
        .orderBy(desc(project.createdAt));

    const goalsByProject = await getGoalsByProjectIds(
        projectData.map((entry) => entry.id),
    );

    for (const projectEntry of projectData) {
        cacheTag(
            cacheTags.projects.byId(projectEntry.id),
            cacheTags.projects.image(projectEntry.id),
            cacheTags.projects.goals(projectEntry.id),
        );
    }

    return projectData.map((entry) => ({
        ...entry,
        goals: goalsByProject.get(entry.id) ?? [],
    }));
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

    const projectData = await db
        .select({
            id: project.id,
            title: project.title,
            shortDescription: project.shortDescription,
            openCollectiveID: project.openCollectiveID,
            projectMainImage: projectImage.url,
        })
        .from(project)
        .leftJoin(
            projectImage,
            and(
                eq(project.id, projectImage.projectId),
                eq(projectImage.isPrimary, true),
            ),
        )
        .where(eq(project.creator, userid))
        .orderBy(desc(project.createdAt));

    const goalsByProject = await getGoalsByProjectIds(
        projectData.map((entry) => entry.id),
    );

    for (const projectEntry of projectData) {
        cacheTag(
            cacheTags.projects.byId(projectEntry.id),
            cacheTags.projects.image(projectEntry.id),
            cacheTags.projects.goals(projectEntry.id),
        );
    }

    return projectData.map((entry) => ({
        ...entry,
        goals: goalsByProject.get(entry.id) ?? [],
    }));
}

export type projects = Awaited<ReturnType<typeof getAllProjects>>;
export type Project = projects[number];
export type ProjectDetails = Awaited<ReturnType<typeof getProjectById>>;
export type ProjectGoal = NonNullable<ProjectDetails>["goals"][number];
export type ProjectGoalFormValue = Omit<ProjectGoal, "id" | "amount"> & {
    clientId: string;
    amount: string;
};
