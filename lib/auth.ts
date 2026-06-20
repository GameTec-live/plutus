import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { revalidateTag } from "next/cache";
import { env } from "@/env";
import * as schema from "@/lib/db/schema";
import { db } from ".";
import { cacheTags } from "./cache-tags";
import { resend } from "./emails";
import { PasswordResetEmail } from "./emails/password-reset-email";
import { VerifyEmailEmail } from "./emails/verify-email-email";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
                console.log("E-Mail api not configured");
                throw new Error("E-Mail api not configured");
            }

            const { data, error } = await resend.emails.send({
                from: env.RESEND_FROM_EMAIL,
                to: [user.email],
                subject: "Reset your password",
                react: PasswordResetEmail({ url }),
            });
            if (error) {
                console.error("Failed to send password reset email:", error);
                throw new Error("Failed to send password reset email");
            }
            console.log("Password reset email sent:", data);
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        async sendVerificationEmail({ user, url }) {
            if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
                console.log("E-Mail api not configured");
                throw new Error("E-Mail api not configured");
            }

            const { data, error } = await resend.emails.send({
                from: env.RESEND_FROM_EMAIL,
                to: [user.email],
                subject: "Verify your email",
                react: VerifyEmailEmail({ url }),
            });
            if (error) {
                console.error(
                    "Failed to send email verification email:",
                    error,
                );
                throw new Error("Failed to send email verification email");
            }
            console.log("Email verification email sent:", data);
        },
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
        changeEmail: {
            enabled: true,
        },
        deleteUser: {
            enabled: true,
        },
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
    databaseHooks: {
        user: {
            update: {
                async after(user) {
                    revalidateTag(cacheTags.users.byId(user.id), "max");
                },
            },
        },
    },
});
