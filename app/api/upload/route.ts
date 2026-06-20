import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { deleteObject } from "@better-upload/server/helpers";
import { headers } from "next/headers";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { s3 } from "@/lib/s3";

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
            fileTypes: ["image/*"],
            multipleFiles: true,
            onBeforeUpload: async () => {
                const session = await auth.api.getSession({
                    headers: await headers(),
                });

                if (!session) {
                    throw new RejectUpload("unauthorized");
                }
            },

            onAfterSignedUrl: async ({ files }) => {
                for (const file of files) {
                    // TODO: save file to DB (ProjectImages)
                    console.log("File uploaded:", file.objectInfo.key);
                }
            },
        }),
    },
};

export const { POST } = toRouteHandler(router);
