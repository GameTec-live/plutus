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

type FieldState = "idle" | "valid" | "error";

interface FieldStatus {
    state: FieldState;
    message: string;
}

function getCharsetSize(pw: string): number {
    let size = 0;
    if (/[a-z]/.test(pw)) size += 26;
    if (/[A-Z]/.test(pw)) size += 26;
    if (/[0-9]/.test(pw)) size += 10;
    if (/[^a-zA-Z0-9]/.test(pw)) size += 32;
    return size;
}

function getPasswordEntropy(pw: string): {
    bits: number;
    label: string;
    score: number;
} {
    if (!pw) return { bits: 0, label: "", score: 0 };
    const R = getCharsetSize(pw);
    const L = pw.length;
    const bits = Math.log2(R) * L;

    if (bits < 28) return { bits, label: "Very weak", score: 1 };
    if (bits < 36) return { bits, label: "Weak", score: 2 };
    if (bits < 60) return { bits, label: "Fair", score: 3 };
    if (bits < 128) return { bits, label: "Strong", score: 4 };
    return { bits, label: "Very strong", score: 5 };
}

function FieldMessage({ status }: { status: FieldStatus }) {
    if (status.state === "valid") return null;
    if (status.state === "idle") {
        return <FieldDescription>{status.message}</FieldDescription>;
    }
    return <p className="text-sm text-destructive mt-1">{status.message}</p>;
}

function StrengthBar({ score }: { score: number }) {
    const colors = [
        "",
        "bg-red-500",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-green-500",
        "bg-emerald-500",
    ];
    return (
        <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
                className={cn(
                    "h-full rounded-full transition-all duration-300",
                    colors[score],
                )}
                style={{ width: `${score * 20}%` }}
            />
        </div>
    );
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [pwScore, setPwScore] = useState(0);

    const [usernameStatus, setUsernameStatus] = useState<FieldStatus>({
        state: "idle",
        message: "Letters, numbers, and underscores only.",
    });
    const [emailStatus, setEmailStatus] = useState<FieldStatus>({
        state: "idle",
        message: "We'll never share your email.",
    });
    const [passwordStatus, setPasswordStatus] = useState<FieldStatus>({
        state: "idle",
        message: "Must be at least 8 characters long.",
    });
    const [confirmStatus, setConfirmStatus] = useState<FieldStatus>({
        state: "idle",
        message: "Please confirm your password.",
    });

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const validateUsername = (value: string) => {
        if (!value) {
            setUsernameStatus({
                state: "idle",
                message: "Letters, numbers, and underscores only.",
            });
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
            setUsernameStatus({
                state: "error",
                message:
                    "3–20 characters, letters, numbers, or underscores only.",
            });
        } else {
            setUsernameStatus({ state: "valid", message: "" });
        }
    };

    const validateEmail = (value: string) => {
        if (!value) {
            setEmailStatus({
                state: "idle",
                message: "We'll never share your email.",
            });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailStatus({
                state: "error",
                message: "Enter a valid email address, e.g. you@example.com.",
            });
        } else {
            setEmailStatus({ state: "valid", message: "" });
        }
    };

    const validatePassword = (value: string) => {
        const { label, score } = getPasswordEntropy(value);
        setPwScore(score);

        if (!value) {
            setPasswordStatus({
                state: "idle",
                message: "Must be at least 8 characters long.",
            });
        } else if (value.length < 8) {
            setPasswordStatus({
                state: "error",
                message: "Too short, need at least 8 characters.",
            });
        } else {
            setPasswordStatus({ state: "idle", message: `Strength: ${label}` });
        }

        const confirm = confirmPasswordRef.current?.value ?? "";
        if (confirm) validateConfirm(confirm, value);
    };

    const validateConfirm = (value: string, pw?: string) => {
        const password = pw ?? passwordRef.current?.value ?? "";
        if (!value) {
            setConfirmStatus({
                state: "idle",
                message: "Please confirm your password.",
            });
        } else if (value !== password) {
            setConfirmStatus({
                state: "error",
                message: "Passwords do not match.",
            });
        } else {
            setConfirmStatus({ state: "valid", message: "" });
        }
    };

    const isFormValid = () =>
        usernameStatus.state === "valid" &&
        emailStatus.state === "valid" &&
        confirmStatus.state === "valid" &&
        (passwordRef.current?.value.length ?? 0) >= 8;

    const signUpEmail = async () => {
        validateUsername(nameRef.current?.value ?? "");
        validateEmail(emailRef.current?.value ?? "");
        validatePassword(passwordRef.current?.value ?? "");
        validateConfirm(confirmPasswordRef.current?.value ?? "");

        if (!isFormValid()) return;

        setSubmitError(null);

        await authClient.signUp.email(
            {
                email: emailRef.current?.value ?? "",
                password: passwordRef.current?.value ?? "",
                name: nameRef.current?.value ?? "",
                callbackURL: "/",
            },
            {
                onRequest: () => setLoading(true),
                onSuccess: () => {
                    setLoading(false);
                    redirect("/onboarding");
                },
                onError: (ctx) => {
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

                {/* Username */}
                <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="johndoe110"
                        required
                        ref={nameRef}
                        className={cn(
                            "bg-background",
                            usernameStatus.state === "error" &&
                                "border-destructive focus-visible:ring-destructive",
                        )}
                        onChange={(e) => validateUsername(e.target.value)}
                    />
                    <FieldMessage status={usernameStatus} />
                </Field>

                {/* Email */}
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        ref={emailRef}
                        className={cn(
                            "bg-background",
                            emailStatus.state === "error" &&
                                "border-destructive focus-visible:ring-destructive",
                        )}
                        onChange={(e) => validateEmail(e.target.value)}
                    />
                    <FieldMessage status={emailStatus} />
                </Field>

                {/* Password */}
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        ref={passwordRef}
                        className={cn(
                            "bg-background",
                            passwordStatus.state === "error" &&
                                "border-destructive focus-visible:ring-destructive",
                        )}
                        onChange={(e) => validatePassword(e.target.value)}
                    />
                    {pwScore > 0 && <StrengthBar score={pwScore} />}
                    <FieldMessage status={passwordStatus} />
                </Field>

                {/* Confirm Password */}
                <Field>
                    <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        ref={confirmPasswordRef}
                        className={cn(
                            "bg-background",
                            confirmStatus.state === "error" &&
                                "border-destructive focus-visible:ring-destructive",
                        )}
                        onChange={(e) => validateConfirm(e.target.value)}
                    />
                    <FieldMessage status={confirmStatus} />
                </Field>

                {/* Submit error */}
                {submitError && (
                    <p className="text-sm text-destructive -mt-2">
                        {submitError}
                    </p>
                )}

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