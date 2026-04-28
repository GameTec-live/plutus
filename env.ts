import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
    server: {
        BETTER_AUTH_SECRET: z.string().length(32),
        BETTER_AUTH_URL: z.url(),

        DATABASE_URL: z.string().min(1),

        MEILI_INDEX: z.string().min(1),
        MEILI_MANAGE_KEY: z.string().min(1),
        MEILI_MASTER_KEY: z.string().nullable(),
        MEILI_SEARCH_KEY: z.string().min(1),
        MEILI_URL: z.url(),

        OPEN_COLLECTIVE_COLLECTIVE_CURRENCY: z.string().min(1).max(3),
        OPEN_COLLECTIVE_COLLECTIVE_URL: z.url(),
        OPEN_COLLECTIVE_ENDPOINT: z.url(),
        OPEN_COLLECTIVE_TOKEN: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_MEILI_INDEX: z.string().min(1),
        NEXT_PUBLIC_MEILI_SEARCH_KEY: z.string().min(1),
        NEXT_PUBLIC_MEILI_URL: z.url(),
        NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY: z
            .string()
            .min(1)
            .max(3),
    },

    experimental__runtimeEnv: {
        NEXT_PUBLIC_MEILI_INDEX: process.env.NEXT_PUBLIC_MEILI_INDEX,
        NEXT_PUBLIC_MEILI_SEARCH_KEY: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY,
        NEXT_PUBLIC_MEILI_URL: process.env.NEXT_PUBLIC_MEILI_URL,
        NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY:
            process.env.NEXT_PUBLIC_OPEN_COLLECTIVE_COLLECTIVE_CURRENCY,
    },
});
