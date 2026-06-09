import { RejectUpload, type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
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
        }),
    },
};

export const { POST } = toRouteHandler(router);
