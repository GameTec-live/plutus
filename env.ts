import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        BETTER_AUTH_SECRET: z.string().min(32),
        BETTER_AUTH_URL: z.url(),

        DATABASE_URL: z.string().min(1),

        GITHUB_CLIENT_ID: z.string().min(1).nullish(),
        GITHUB_CLIENT_SECRET: z.string().min(1).nullish(),

        MEILI_INDEX: z.string().min(1),
        MEILI_MASTER_KEY: z.string().min(1),
        MEILI_SEARCH_KEY: z.string().min(1),
        MEILI_URL: z.url(),

        OAUTH_CLIENT_ID: z.string().min(1).nullish(),
        OAUTH_CLIENT_SECRET: z.string().min(1).nullish(),
        OAUTH_DISCOVERY_URL: z.url().nullish(),

        OPEN_COLLECTIVE_COLLECTIVE_CURRENCY: z.string().min(1).max(3),
        OPEN_COLLECTIVE_COLLECTIVE_URL: z.url(),
        OPEN_COLLECTIVE_ENDPOINT: z.url(),
        OPEN_COLLECTIVE_TOKEN: z.string().min(1),

        S3_CLIENT: z.enum(["cloudflare", "backblaze", "custom"]),

        S3_ACCESS_KEY_ID: z.string().min(1).nullish(),
        S3_ACCOUNT_ID: z.string().min(1).nullish(),
        S3_BUCKETNAME: z.string().min(1),
        S3_HOST: z.string().min(1).nullish(),
        S3_KEY: z.string().min(1).nullish(),
        S3_KEY_ID: z.string().min(1).nullish(),
        S3_PUBLIC_URL: z.string().min(1),
        S3_REGION: z.string().min(1).nullish(),
        S3_SECRET_ACCESS_KEY: z.string().min(1).nullish(),
        RESEND_API_KEY: z.string().min(1).nullish(),
        RESEND_FROM_EMAIL: z.email().nullish(),
        RESEND_BASE_URL: z.url().nullish(),
    },
    client: {
        NEXT_PUBLIC_GITHUB_ENABLED: z.stringbool().default(false),
        NEXT_PUBLIC_MEILI_INDEX: z.string().min(1),
        NEXT_PUBLIC_MEILI_SEARCH_KEY: z.string().min(1),
        NEXT_PUBLIC_MEILI_URL: z.url(),
        NEXT_PUBLIC_OAUTH_ENABLED: z.stringbool().default(false),
        NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY: z
            .string()
            .min(1)
            .max(3),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_GITHUB_ENABLED: process.env.NEXT_PUBLIC_GITHUB_ENABLED,
        NEXT_PUBLIC_MEILI_INDEX: process.env.NEXT_PUBLIC_MEILI_INDEX,
        NEXT_PUBLIC_MEILI_SEARCH_KEY: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY,
        NEXT_PUBLIC_MEILI_URL: process.env.NEXT_PUBLIC_MEILI_URL,
        NEXT_PUBLIC_OAUTH_ENABLED: process.env.NEXT_PUBLIC_OAUTH_ENABLED,
        NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY:
            process.env.NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY,
    },
});
