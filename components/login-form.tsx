"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export function LoginForm({ className }: React.ComponentProps<"form">) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const sessionRef = useRef<HTMLInputElement>(null);

    const signIn = async () => {
        if (!emailRef.current?.value) {
            setSubmitError("Please enter your email address.");
            return;
        }

        if (!passwordRef.current?.value) {
            setSubmitError("Please enter your password.");
            return;
        }

        setSubmitError(null);

        await authClient.signIn.email(
            {
                email: emailRef.current.value,
                password: passwordRef.current?.value ?? "",
                callbackURL: "/",
                rememberMe: sessionRef.current?.checked ?? false,
            },
            {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    setLoading(false);
                    router.push("/onboarding");
                },
                onError: (ctx) => {
                    if (ctx.error.message.includes("[body.email]")) {
                        setSubmitError("Invalid email address.");
                        setLoading(false);
                        return;
                    }

                    setSubmitError(ctx.error.message);
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

    return (
        <form className={cn("flex flex-col gap-6", className)}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">
                        Login to your account
                    </h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                {/* Email */}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        ref={emailRef}
                        required
                    />
                </Field>

                {/* Password */}
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        {/* Forgot Password Link hidden until mail server configured*/}
                        {/*
                        <a
                            href="/reset-password"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                        */}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        ref={passwordRef}
                        required
                    />
                    <Field orientation="horizontal">
                        <Checkbox
                            id="session-checkbox"
                            name="session-checkbox"
                            ref={sessionRef}
                        />
                        <FieldLabel htmlFor="session-checkbox">
                            Remember me
                        </FieldLabel>
                    </Field>
                </Field>

                {/* Login Button */}
                <Field>
                    {submitError && (
                        <p className="text-sm font-medium text-destructive">
                            {submitError}
                        </p>
                    )}

                    <Button onClick={signIn} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </Field>

                <FieldSeparator>Or continue with</FieldSeparator>

                {/* GitHub */}
                <Field>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={signInGithub}
                    >
                        Login with GitHub
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/signup"
                            className="underline underline-offset-4"
                        >
                            Sign up
                        </a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}
