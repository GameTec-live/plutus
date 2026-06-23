import { deleteObjects, headObject } from "@better-upload/server/helpers";
import { env } from "@/env";
import type { CreateProjectInput } from "@/lib/project-creation";
import {
    isOwnedProjectImageKey,
    PROJECT_IMAGE_MAX_SIZE,
    PROJECT_IMAGE_TYPES,
} from "@/lib/project-creation";
import { s3 } from "@/lib/s3";

export async function deleteProjectImageKeys(keys: string[]) {
    if (keys.length === 0) return;
    try {
        const result = await deleteObjects(s3, {
            bucket: env.S3_BUCKETNAME,
            objects: keys.map((key) => ({ key })),
            quiet: true,
        });
        if (result.errors.length > 0) {
            console.error(
                "Failed to clean up some project images",
                result.errors,
            );
        }
    } catch (error) {
        console.error("Failed to clean up project images", error);
    }
}

export async function verifyProjectImages(
    images: CreateProjectInput["images"],
    userId: string,
    projectId: string,
) {
    for (const image of images) {
        if (!isOwnedProjectImageKey(image.key, userId, projectId)) {
            throw new Error("Image key does not belong to this submission.");
        }
        const object = await headObject(s3, {
            bucket: env.S3_BUCKETNAME,
            key: image.key,
        });
        if (
            object.contentLength <= 0 ||
            object.contentLength > PROJECT_IMAGE_MAX_SIZE ||
            !PROJECT_IMAGE_TYPES.includes(
                object.contentType as (typeof PROJECT_IMAGE_TYPES)[number],
            )
        ) {
            throw new Error("Uploaded image metadata is invalid.");
        }
    }
}
