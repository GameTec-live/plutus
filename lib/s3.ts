import { backblaze } from "@better-upload/server/clients";
import { env } from "@/env";

export const s3 = backblaze({
    region: env.S3_REGION,
    applicationKeyId: env.S3_KEY_ID,
    applicationKey: env.S3_KEY,
});
