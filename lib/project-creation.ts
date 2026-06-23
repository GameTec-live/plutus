import { z } from "zod";
import type { ProjectGoalFormValue } from "@/lib/db/queries/project";
import { hasVisibleText, validateProjectGoals } from "@/lib/project-goals";

export const PROJECT_TITLE_MAX = 100;
export const PROJECT_SHORT_DESCRIPTION_MAX = 280;
export const PROJECT_LONG_DESCRIPTION_MAX = 20_000;
export const PROJECT_IMAGE_MAX_COUNT = 10;
export const PROJECT_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const PROJECT_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
] as const;

export type ProjectImageType = (typeof PROJECT_IMAGE_TYPES)[number];

export type CreateProjectImageInput = {
    key: string;
    isPrimary: boolean;
};

export type CreateProjectInput = {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    images: CreateProjectImageInput[];
    goals: ProjectGoalFormValue[];
};

export type CreateProjectResult =
    | { ok: true; projectId: string }
    | {
          ok: false;
          code:
              | "UNAUTHORIZED"
              | "VALIDATION"
              | "UPLOAD"
              | "OPEN_COLLECTIVE"
              | "DATABASE"
              | "CONFIGURATION";
          message: string;
          fieldErrors?: Record<string, string[]>;
      };

export function validateProjectTextFields(input: {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
}) {
    const errors: Record<string, string[]> = {};
    const addError = (path: string, message: string) => {
        errors[path] = [...(errors[path] ?? []), message];
    };

    if (!z.uuid().safeParse(input.id).success) {
        addError("id", "The project submission ID is invalid.");
    }
    if (!hasVisibleText(input.title)) {
        addError("title", "Project name is required.");
    } else if (input.title.trim().length > PROJECT_TITLE_MAX) {
        addError(
            "title",
            `Project name must be ${PROJECT_TITLE_MAX} characters or fewer.`,
        );
    }
    if (!hasVisibleText(input.shortDescription)) {
        addError("shortDescription", "Short description is required.");
    } else if (
        input.shortDescription.trim().length > PROJECT_SHORT_DESCRIPTION_MAX
    ) {
        addError(
            "shortDescription",
            `Short description must be ${PROJECT_SHORT_DESCRIPTION_MAX} characters or fewer.`,
        );
    }
    if (input.longDescription.length > PROJECT_LONG_DESCRIPTION_MAX) {
        addError(
            "longDescription",
            `Detailed description must be ${PROJECT_LONG_DESCRIPTION_MAX.toLocaleString()} characters or fewer.`,
        );
    }

    return errors;
}

export function validateProjectCreation(input: CreateProjectInput) {
    const errors = validateProjectTextFields(input);
    const addError = (path: string, message: string) => {
        errors[path] = [...(errors[path] ?? []), message];
    };

    if (input.images.length > PROJECT_IMAGE_MAX_COUNT) {
        addError(
            "images",
            `Choose no more than ${PROJECT_IMAGE_MAX_COUNT} images.`,
        );
    }
    if (
        new Set(input.images.map((image) => image.key)).size !==
        input.images.length
    ) {
        addError("images", "Duplicate project images are not allowed.");
    }
    const primaryImageCount = input.images.filter(
        (image) => image.isPrimary,
    ).length;
    if (input.images.length > 0 && primaryImageCount !== 1) {
        addError("images", "Select exactly one primary project image.");
    }

    const goalValidation = validateProjectGoals(input.goals);
    for (const [path, messages] of Object.entries(goalValidation.errors)) {
        errors[path === "goals" ? path : `goals.${path}`] = messages;
    }

    return {
        errors,
        normalized: {
            id: input.id,
            title: input.title.trim(),
            shortDescription: input.shortDescription.trim(),
            longDescription: hasVisibleText(input.longDescription)
                ? input.longDescription.trim()
                : null,
            images: input.images,
            goals: goalValidation.goals,
        },
    };
}

export function getProjectUploadPrefix(userId: string, projectId: string) {
    return `project-images/${encodeURIComponent(userId)}/${projectId}/`;
}

export function isOwnedProjectImageKey(
    key: string,
    userId: string,
    projectId: string,
) {
    return (
        key.startsWith(getProjectUploadPrefix(userId, projectId)) &&
        !key.includes("..") &&
        key.length <= 512
    );
}

export function getPublicProjectImageUrl(publicBase: string, key: string) {
    return `${publicBase.replace(/\/$/, "")}/${key}`;
}
