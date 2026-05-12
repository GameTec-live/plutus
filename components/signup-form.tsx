"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import type * as React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const password = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const confirmPassword = useRef<HTMLInputElement>(null);
    const name = useRef<HTMLInputElement>(null);

    const signUpEmail = async () => {
        if (
            !email.current ||
            !password.current ||
            !confirmPassword.current ||
            !name.current
        ) {
            return;
        }

        if (password.current.value !== confirmPassword.current.value) {
            setError("Passwords do not match");
            return;
        }

        await authClient.signUp.email(
            {
                email: email.current.value,
                password: password.current.value,
                name: name.current.value,
                callbackURL: "/",
            },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onSuccess: () => {
                    setLoading(false);
                    redirect("/onboarding");
                },
                onError: (ctx) => {
                    setError(ctx.error.message);
                    setLoading(false);
                },
            },
        );
    };

    const signInGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            newUserCallbackURL: "/onboarding",
        });
    };

    const signInOIDC = async () => {
        await authClient.signIn.oauth2({
            providerId: "oauth",
            callbackURL: "/dashboard",
            newUserCallbackURL: "/onboarding",
            scopes: ["openid", "profile", "email"],
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-start gap-1 text-left">
                    <h1 className="text-xl font-bold">Create your account</h1>
                </div>

                <Field>
                    <FieldLabel htmlFor="name">Username</FieldLabel>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="johndoe110"
                        required
                        className="bg-background"
                        ref={name}
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="bg-background"
                        ref={email}
                    />
                    <FieldDescription>
                        We&apos;ll use this to contact you. We will not share
                        your email with anyone else.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-background"
                        ref={password}
                    />
                    <FieldDescription>
                        Must be at least 8 characters long.
                    </FieldDescription>
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        className="bg-background"
                        ref={confirmPassword}
                    />
                    <FieldDescription>
                        Please confirm your password.
                    </FieldDescription>

                    {error && (
                        <p className="text-sm text-destructive mt-1">{error}</p>
                    )}
                </Field>

                <Field>
                    <Button onClick={signUpEmail} disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                <Field>
                    {env.NEXT_PUBLIC_GITHUB_ENABLED && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={signInGithub}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <title>GitHub</title>
                                <path
                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                    fill="currentColor"
                                />
                            </svg>
                            SignUp with GitHub
                        </Button>
                    )}

                    {env.NEXT_PUBLIC_OAUTH_ENABLED && (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={signInOIDC}
                        >
                            SignUp with OIDC
                        </Button>
                    )}

                    <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link href="/signin">Sign in</Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </div>
    );
}
