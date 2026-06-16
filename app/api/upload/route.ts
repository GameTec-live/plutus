import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { Console } from "console";
import { headers } from "next/headers";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { s3 } from "@/lib/s3";

const router: Router = {
    client: s3, // or cloudflare(), backblaze(), tigris(), ...
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
                console.log(file.objectInfo.key);
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
                // the files now have the objectInfo property
                for (const file of files) {
                    console.log("File uploaded:", file.objectInfo.key);
                }
            },
        }),
    },
};

export const { POST } = toRouteHandler(router);
