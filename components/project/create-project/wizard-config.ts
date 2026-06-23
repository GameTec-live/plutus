import {
    PROJECT_IMAGE_MAX_COUNT,
    PROJECT_IMAGE_MAX_SIZE,
    PROJECT_IMAGE_TYPES,
    validateProjectTextFields,
} from "@/lib/project-creation";
import { validateProjectGoals } from "@/lib/project-goals";
import type {
    CreateProjectFormValue,
    WizardErrors,
    WizardImage,
} from "./types";

export const wizardSteps = [
    {
        name: "Project name",
        title: "Name your project",
        description: "Choose a clear name supporters will recognize.",
    },
    {
        name: "Short description",
        title: "Summarize your project",
        description: "Explain the project in one concise paragraph.",
    },
    {
        name: "Detailed description",
        title: "Tell the full story",
        description: "Add an optional, detailed markdown description.",
    },
    {
        name: "Images",
        title: "Show your project",
        description: "Add up to ten images and choose the primary image.",
    },
    {
        name: "Goals",
        title: "Define funding goals",
        description: "Add optional normal and stretch funding milestones.",
    },
] as const;

export function validateWizardImages(images: WizardImage[]) {
    const errors: string[] = [];
    if (images.length > PROJECT_IMAGE_MAX_COUNT) {
        errors.push(`Choose no more than ${PROJECT_IMAGE_MAX_COUNT} images.`);
    }
    if (
        images.length > 0 &&
        images.filter((image) => image.isPrimary).length !== 1
    ) {
        errors.push("Select exactly one primary image.");
    }
    for (const image of images) {
        if (!PROJECT_IMAGE_TYPES.includes(image.file.type as never)) {
            errors.push(`${image.file.name} is not a supported image type.`);
        } else if (image.file.size > PROJECT_IMAGE_MAX_SIZE) {
            errors.push(`${image.file.name} is larger than 5 MB.`);
        }
    }
    return errors;
}

function goalErrors(value: CreateProjectFormValue): WizardErrors {
    return Object.fromEntries(
        Object.entries(validateProjectGoals(value.goals).errors).map(
            ([path, messages]) => [
                path === "goals" ? path : `goals.${path}`,
                messages,
            ],
        ),
    );
}

export function validateWizardStep(
    step: number,
    value: CreateProjectFormValue,
): WizardErrors {
    const textErrors = validateProjectTextFields(value);
    if (step === 0 && textErrors.title) return { title: textErrors.title };
    if (step === 1 && textErrors.shortDescription) {
        return { shortDescription: textErrors.shortDescription };
    }
    if (step === 2 && textErrors.longDescription) {
        return { longDescription: textErrors.longDescription };
    }
    if (step === 3) {
        const images = validateWizardImages(value.images);
        return images.length > 0 ? { images } : {};
    }
    if (step === 4) return goalErrors(value);
    return {};
}

export function validateWizard(value: CreateProjectFormValue): WizardErrors {
    const errors: WizardErrors = {
        ...validateProjectTextFields(value),
        ...goalErrors(value),
    };
    const images = validateWizardImages(value.images);
    if (images.length > 0) errors.images = images;
    return errors;
}
