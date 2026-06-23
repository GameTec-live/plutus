"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { cacheTags } from "@/lib/cache-tags";
import { persistCreatedProject } from "@/lib/db/mutations/create-project";
import { project } from "@/lib/db/schema";
import { getOpenCollectiveParentSlug } from "@/lib/oc/project-creation";
import {
    createOpenCollectiveProject,
    deleteOpenCollectiveProject,
} from "@/lib/oc/queries/project";
import {
    type CreateProjectInput,
    type CreateProjectResult,
    isOwnedProjectImageKey,
    validateProjectCreation,
} from "@/lib/project-creation";
import {
    deleteProjectImageKeys,
    verifyProjectImages,
} from "@/lib/project-image-storage";

function failure(
    code: Exclude<CreateProjectResult, { ok: true }>["code"],
    message: string,
    fieldErrors?: Record<string, string[]>,
): CreateProjectResult {
    return { ok: false, code, message, fieldErrors };
}

function invalidateCreatedProject(projectId: string, userId: string) {
    updateTag(cacheTags.projects.all);
    updateTag(cacheTags.projects.db);
    updateTag(cacheTags.projects.list);
    updateTag(cacheTags.projects.grid);
    updateTag(cacheTags.projects.byId(projectId));
    updateTag(cacheTags.projects.image(projectId));
    updateTag(cacheTags.projects.goals(projectId));
    updateTag(cacheTags.projects.byUser(userId));
    updateTag(cacheTags.openCollective.projectBalance(projectId));
}

export async function createProject(
    input: CreateProjectInput,
): Promise<CreateProjectResult> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return failure("UNAUTHORIZED", "Sign in to create a project.");
    }

    const validation = validateProjectCreation(input);
    const uploadedKeys = input.images
        .map((image) => image.key)
        .filter((key) =>
            isOwnedProjectImageKey(key, session.user.id, input.id),
        );
    if (Object.keys(validation.errors).length > 0) {
        await deleteProjectImageKeys(uploadedKeys);
        return failure(
            "VALIDATION",
            "Review the highlighted project fields.",
            validation.errors,
        );
    }

    const [existing] = await db
        .select({ creator: project.creator })
        .from(project)
        .where(eq(project.id, input.id))
        .limit(1);
    if (existing) {
        await deleteProjectImageKeys(uploadedKeys);
        return existing.creator === session.user.id
            ? { ok: true, projectId: input.id }
            : failure(
                  "VALIDATION",
                  "The project submission ID is unavailable.",
              );
    }

    try {
        getOpenCollectiveParentSlug();
    } catch (error) {
        console.error("Invalid Open Collective configuration", error);
        await deleteProjectImageKeys(uploadedKeys);
        return failure(
            "CONFIGURATION",
            "Project creation is temporarily unavailable.",
        );
    }

    try {
        await verifyProjectImages(input.images, session.user.id, input.id);
    } catch (error) {
        console.error("Project image verification failed", error);
        await deleteProjectImageKeys(uploadedKeys);
        return failure(
            "UPLOAD",
            "One or more images could not be verified. Please try again.",
        );
    }

    let openCollective: { slug: string; created: boolean };
    try {
        openCollective = await createOpenCollectiveProject({
            projectId: input.id,
            title: validation.normalized.title,
            description: validation.normalized.shortDescription,
        });
    } catch (error) {
        console.error("Failed to create Open Collective project", error);
        await deleteProjectImageKeys(uploadedKeys);
        return failure(
            "OPEN_COLLECTIVE",
            "The Open Collective project could not be created. Please try again.",
        );
    }

    try {
        await persistCreatedProject({
            project: validation.normalized,
            creatorId: session.user.id,
            openCollectiveSlug: openCollective.slug,
        });
    } catch (error) {
        console.error("Failed to save created project", error);
        if (openCollective.created) {
            try {
                await deleteOpenCollectiveProject(openCollective.slug);
            } catch (cleanupError) {
                console.error(
                    "Failed to compensate Open Collective project creation",
                    cleanupError,
                );
            }
        }
        await deleteProjectImageKeys(uploadedKeys);
        return failure(
            "DATABASE",
            "The project could not be saved. Please try again.",
        );
    }

    invalidateCreatedProject(input.id, session.user.id);
    return { ok: true, projectId: input.id };
}
