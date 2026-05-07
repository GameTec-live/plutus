"use client";

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

        const { error } = await authClient.signUp.email(
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
                    redirect("/");
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
                    <Button
                        variant="outline"
                        type="button"
                        onClick={signInGithub}
                    >
                        Sign up with GitHub
                    </Button>

                    <Button variant="outline" type="button">
                        Sign up with OIDC
                    </Button>

                    <FieldDescription className="px-6 text-center">
                        Already have an account? <a href="../signin">Sign in</a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </div>
    );
}
