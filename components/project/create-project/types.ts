import type { ProjectGoalFormValue } from "@/lib/db/queries/project";

export type WizardImage = {
    clientId: string;
    file: File;
    previewUrl: string;
    isPrimary: boolean;
};

export type CreateProjectFormValue = {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    images: WizardImage[];
    goals: ProjectGoalFormValue[];
};

export type WizardErrors = Record<string, string[]>;

export type SubmissionStage =
    | "Uploading images"
    | "Creating project"
    | "Opening project";
