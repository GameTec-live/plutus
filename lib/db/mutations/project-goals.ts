"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { cacheTags } from "@/lib/cache-tags";
import type { ProjectGoalFormValue } from "@/lib/db/queries/project";
import { project, projectGoal } from "@/lib/db/schema";
import { validateProjectGoals } from "@/lib/project-goals";

function failure<Code extends string>(
    code: Code,
    message: string,
    fieldErrors?: Record<string, string[]>,
) {
    const ok = false;
    return { ok, code, message, fieldErrors };
}

export async function replaceProjectGoals({
    projectId,
    goals,
}: {
    projectId: string;
    goals: ProjectGoalFormValue[];
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return failure("UNAUTHORIZED", "Sign in to update project goals.");
    }

    if (!z.uuid().safeParse(projectId).success) {
        return failure("VALIDATION", "The project ID is invalid.");
    }

    const validation = validateProjectGoals(goals);
    if (Object.keys(validation.errors).length > 0) {
        return failure(
            "VALIDATION",
            "Review the highlighted goal fields.",
            validation.errors,
        );
    }

    try {
        const [projectOwner] = await db
            .select({ creator: project.creator })
            .from(project)
            .where(eq(project.id, projectId))
            .limit(1);

        if (!projectOwner) {
            return failure("NOT_FOUND", "Project not found.");
        }
        if (projectOwner.creator !== session.user.id) {
            return failure(
                "FORBIDDEN",
                "You do not have permission to edit this project.",
            );
        }

        const deleteGoals = db
            .delete(projectGoal)
            .where(eq(projectGoal.projectId, projectId));

        let savedGoals: {
            id: string;
            title: string;
            description: string;
            amount: number;
            isStretch: boolean;
            isPrimary: boolean;
        }[] = [];

        if (validation.goals.length === 0) {
            await db.batch([deleteGoals]);
        } else {
            const [, insertedGoals] = await db.batch([
                deleteGoals,
                db
                    .insert(projectGoal)
                    .values(
                        validation.goals.map((goal) => ({
                            ...goal,
                            projectId,
                        })),
                    )
                    .returning({
                        id: projectGoal.id,
                        title: projectGoal.title,
                        description: projectGoal.description,
                        amount: projectGoal.amount,
                        isStretch: projectGoal.isStretch,
                        isPrimary: projectGoal.isPrimary,
                    }),
            ]);
            savedGoals = insertedGoals;
        }

        updateTag(cacheTags.projects.all);
        updateTag(cacheTags.projects.db);
        updateTag(cacheTags.projects.list);
        updateTag(cacheTags.projects.grid);
        updateTag(cacheTags.projects.byId(projectId));
        updateTag(cacheTags.projects.goals(projectId));
        updateTag(cacheTags.projects.byUser(session.user.id));

        const ok = true;
        return { ok, goals: savedGoals };
    } catch (error) {
        console.error(
            `Failed to replace goals for project ${projectId}`,
            error,
        );
        return failure(
            "DATABASE",
            "Project goals could not be saved. Please try again.",
        );
    }
}
