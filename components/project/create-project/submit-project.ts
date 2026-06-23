"use client";

import { uploadFiles } from "@better-upload/client";
import { createProject } from "@/lib/actions/create-project";
import { discardProjectUploads } from "@/lib/actions/project-uploads";
import type { CreateProjectResult } from "@/lib/project-creation";
import type { CreateProjectFormValue, SubmissionStage } from "./types";

type SubmissionCallbacks = {
    onStage: (stage: SubmissionStage) => void;
    onUploadProgress: (progress: number) => void;
};

async function cleanup(projectId: string, keys: string[]) {
    if (keys.length > 0) {
        await discardProjectUploads({ projectId, keys });
    }
}

export async function submitProjectForm(
    value: CreateProjectFormValue,
    callbacks: SubmissionCallbacks,
): Promise<CreateProjectResult> {
    let uploadedKeys: string[] = [];
    try {
        let images: { key: string; isPrimary: boolean }[] = [];
        if (value.images.length > 0) {
            callbacks.onStage("Uploading images");
            const upload = await uploadFiles({
                route: "projectImages",
                files: value.images.map((image) => image.file),
                metadata: { projectId: value.id },
                retry: 1,
                onFileStateChange: ({ file }) => {
                    if (file.status === "uploading") {
                        callbacks.onUploadProgress(
                            Math.round(file.progress * 100),
                        );
                    }
                },
            });
            uploadedKeys = upload.files.map((file) => file.objectInfo.key);
            if (
                upload.failedFiles.length > 0 ||
                upload.files.length !== value.images.length
            ) {
                await cleanup(value.id, uploadedKeys);
                return {
                    ok: false,
                    code: "UPLOAD",
                    message: "Some images failed to upload. Please try again.",
                };
            }
            images = value.images.map((image) => {
                const uploaded = upload.files.find(
                    (file) => file.raw === image.file,
                );
                if (!uploaded) {
                    throw new Error("Uploaded image result was incomplete.");
                }
                return {
                    key: uploaded.objectInfo.key,
                    isPrimary: image.isPrimary,
                };
            });
        }

        callbacks.onStage("Creating project");
        return await createProject({
            id: value.id,
            title: value.title,
            shortDescription: value.shortDescription,
            longDescription: value.longDescription,
            goals: value.goals,
            images,
        });
    } catch (error) {
        console.error("Project submission failed", error);
        await cleanup(value.id, uploadedKeys);
        return {
            ok: false,
            code: "UPLOAD",
            message: "Project creation failed unexpectedly. Please try again.",
        };
    }
}
