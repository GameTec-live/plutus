import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { deleteObject } from "@better-upload/server/helpers";
import { headers } from "next/headers";
import { z } from "zod";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import {
    getProjectUploadPrefix,
    PROJECT_IMAGE_MAX_COUNT,
    PROJECT_IMAGE_MAX_SIZE,
    PROJECT_IMAGE_TYPES,
    type ProjectImageType,
} from "@/lib/project-creation";
import { s3 } from "@/lib/s3";

const imageExtension: Record<ProjectImageType, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

const router: Router = {
    client: s3,
    bucketName: env.S3_BUCKETNAME,
    routes: {
        banner: route({
            fileTypes: ["image/*"],
            onBeforeUpload: async () => {
                const session = await auth.api.getSession({
                    headers: await headers(),
                });

                if (!session) {
                    throw new RejectUpload("unauthorized");
                }
            },

            onAfterSignedUrl: async ({ file }) => {
                const session = await auth.api.getSession({
                    headers: await headers(),
                });

                if (!session) return;

                const currentBanner = session.user.bannerImage;
                const url = `${env.S3_PUBLIC_URL}/${file.objectInfo.key}`;

                await auth.api.updateUser({
                    headers: await headers(),
                    body: {
                        bannerImage: url,
                    },
                });

                if (currentBanner) {
                    try {
                        const oldKey = currentBanner.split("/").slice(-1)[0];
                        await deleteObject(s3, {
                            bucket: env.S3_BUCKETNAME,
                            key: oldKey,
                        });
                    } catch (error) {
                        console.error(
                            "Error occurred while deleting old banner image.",
                            error,
                        );
                    }
                }
            },
        }),
        projectImages: route({
            fileTypes: [...PROJECT_IMAGE_TYPES],
            maxFileSize: PROJECT_IMAGE_MAX_SIZE,
            multipleFiles: true,
            maxFiles: PROJECT_IMAGE_MAX_COUNT,
            clientMetadataSchema: z.object({ projectId: z.uuid() }),
            onBeforeUpload: async ({ clientMetadata }) => {
                const session = await auth.api.getSession({
                    headers: await headers(),
                });

                if (!session) {
                    throw new RejectUpload("unauthorized");
                }

                const prefix = getProjectUploadPrefix(
                    session.user.id,
                    clientMetadata.projectId,
                );
                return {
                    generateObjectInfo: ({ file }) => ({
                        key: `${prefix}${crypto.randomUUID()}.${imageExtension[file.type as ProjectImageType]}`,
                    }),
                };
            },
        }),
    },
};

export const { POST } = toRouteHandler(router);
