import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib";
import { cacheTags } from "@/lib/cache-tags";
import { project, projectImage } from "../schema";

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
