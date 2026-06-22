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
import { getProjectGoalErrors, parseAmountToCents } from "@/lib/project-goals";

export async function replaceProjectGoals({
    projectId,
    goals,
}: {
    projectId: string;
    goals: ProjectGoalFormValue[];
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        return {
            ok: false as const,
            code: "UNAUTHORIZED" as const,
            message: "Sign in to update project goals.",
        };
    }

    if (!z.uuid().safeParse(projectId).success) {
        return {
            ok: false as const,
            code: "VALIDATION" as const,
            message: "The project ID is invalid.",
        };
    }

    const fieldErrors = getProjectGoalErrors(goals);
    if (Object.keys(fieldErrors).length > 0) {
        return {
            ok: false as const,
            code: "VALIDATION" as const,
            message: "Review the highlighted goal fields.",
            fieldErrors,
        };
    }

    try {
        const [projectOwner] = await db
            .select({ creator: project.creator })
            .from(project)
            .where(eq(project.id, projectId))
            .limit(1);

        if (!projectOwner) {
            return {
                ok: false as const,
                code: "NOT_FOUND" as const,
                message: "Project not found.",
            };
        }
        if (projectOwner.creator !== session.user.id) {
            return {
                ok: false as const,
                code: "FORBIDDEN" as const,
                message: "You do not have permission to edit this project.",
            };
        }

        const savedGoals = await db.transaction(async (transaction) => {
            await transaction
                .delete(projectGoal)
                .where(eq(projectGoal.projectId, projectId));

            if (goals.length === 0) return [];

            return transaction
                .insert(projectGoal)
                .values(
                    goals.map((goal) => ({
                        projectId,
                        title: goal.title.trim(),
                        description: goal.description.trim(),
                        amount: parseAmountToCents(goal.amount) as number,
                        isStretch: goal.isStretch,
                        isPrimary: goal.isPrimary,
                    })),
                )
                .returning({
                    id: projectGoal.id,
                    title: projectGoal.title,
                    description: projectGoal.description,
                    amount: projectGoal.amount,
                    isStretch: projectGoal.isStretch,
                    isPrimary: projectGoal.isPrimary,
                });
        });

        updateTag(cacheTags.projects.all);
        updateTag(cacheTags.projects.db);
        updateTag(cacheTags.projects.list);
        updateTag(cacheTags.projects.grid);
        updateTag(cacheTags.projects.byId(projectId));
        updateTag(cacheTags.projects.goals(projectId));
        updateTag(cacheTags.projects.byUser(session.user.id));

        return { ok: true as const, goals: savedGoals };
    } catch (error) {
        console.error(
            `Failed to replace goals for project ${projectId}`,
            error,
        );
        return {
            ok: false as const,
            code: "DATABASE" as const,
            message: "Project goals could not be saved. Please try again.",
        };
    }
}
