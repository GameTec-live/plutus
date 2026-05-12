import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
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

    socialProviders:
        env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
            ? {
                  github: {
                      clientId: env.GITHUB_CLIENT_ID,
                      clientSecret: env.GITHUB_CLIENT_SECRET,
                  },
              }
            : undefined,

    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "oauth",
                    // biome-ignore lint/style/noNonNullAssertion: Checked at build time therefore not able to be in a condtion
                    clientId: env.OAUTH_CLIENT_ID!,
                    // biome-ignore lint/style/noNonNullAssertion: See above!
                    clientSecret: env.OAUTH_CLIENT_SECRET!,
                    // biome-ignore lint/style/noNonNullAssertion: See above!
                    discoveryUrl: env.OAUTH_DISCOVERY_URL!,
                },
                // Add more providers as needed
            ],
        }),
    ],
});
