import { backblaze, cloudflare, custom } from "@better-upload/server/clients";
import { env } from "@/env";

export const s3 = (() => {
    switch (env.S3_CLIENT) {
        case "cloudflare":
            if (
                !env.S3_ACCOUNT_ID ||
                !env.S3_ACCESS_KEY_ID ||
                !env.S3_SECRET_ACCESS_KEY
            ) {
                throw new Error(
                    "Missing S3 credentials for Cloudflare. Please set S3_ACCOUNT_ID, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY in your environment variables.",
                );
            }

            return cloudflare({
                accountId: env.S3_ACCOUNT_ID,
                accessKeyId: env.S3_ACCESS_KEY_ID,
                secretAccessKey: env.S3_SECRET_ACCESS_KEY,
            });

        case "backblaze":
            if (!env.S3_REGION || !env.S3_KEY_ID || !env.S3_KEY) {
                throw new Error(
                    "Missing S3 credentials for Backblaze. Please set S3_REGION, S3_KEY_ID, and S3_KEY in your environment variables.",
                );
            }

            return backblaze({
                region: env.S3_REGION,
                applicationKeyId: env.S3_KEY_ID,
                applicationKey: env.S3_KEY,
            });

        case "custom":
            if (
                !env.S3_HOST ||
                !env.S3_ACCESS_KEY_ID ||
                !env.S3_SECRET_ACCESS_KEY ||
                !env.S3_REGION
            ) {
                throw new Error(
                    "Missing S3 credentials for custom S3 client. Please set S3_HOST, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_REGION in your environment variables.",
                );
            }

            return custom({
                host: env.S3_HOST,
                accessKeyId: env.S3_ACCESS_KEY_ID,
                secretAccessKey: env.S3_SECRET_ACCESS_KEY,
                region: env.S3_REGION,
                secure: true,
                forcePathStyle: false,
            });

        default:
            throw new Error(
                `Unsupported S3_CLIENT: ${env.S3_CLIENT}. Expected cloudflare, backblaze, or custom.`,
            );
    }
})();
