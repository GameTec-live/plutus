import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { db } from ".";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    baseURL: {
        allowedHosts: [
            "localhost:3000",
            "localhost:5173",
            "plutus.gtlv.org",
            "*.vercel.app",
            new URL(env.BETTER_AUTH_URL).host,
        ],
        protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    },
    user: {
        additionalFields: {
            bannerImage: {
                type: "string",
                required: false,
            },
            bio: {
                type: "string",
                required: false,
            },
        },
    },
});
