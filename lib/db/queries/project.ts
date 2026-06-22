import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib";
import { cacheTags } from "@/lib/cache-tags";
import { project, projectImage, user } from "../schema";

export async function getProjectById(id: string) {
    "use cache";
    cacheLife("days");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.projects.db,
        cacheTags.projects.byId(id),
        cacheTags.projects.image(id),
    );

    const [projectRows, images] = await Promise.all([
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
    ]);

    const projectData = projectRows[0];

    if (!projectData) {
        return undefined;
    }

    cacheTag(cacheTags.users.byId(projectData.creator.id));

    return { ...projectData, images };
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

    for (const projectEntry of projectData) {
        cacheTag(
            cacheTags.projects.byId(projectEntry.id),
            cacheTags.projects.image(projectEntry.id),
        );
    }

    return projectData;
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

    for (const projectEntry of projectData) {
        cacheTag(
            cacheTags.projects.byId(projectEntry.id),
            cacheTags.projects.image(projectEntry.id),
        );
    }

    return projectData;
}

export type projects = Awaited<ReturnType<typeof getAllProjects>>;
export type Project = projects[number];
export type ProjectDetails = Awaited<ReturnType<typeof getProjectById>>;
