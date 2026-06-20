"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({ className }: React.ComponentProps<"div">) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isPending, startReset] = useTransition();
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);

    const resetPassword = async () => {
        startReset(async () => {
            if (!emailRef.current?.value) {
                setSubmitError("Please enter your email address.");
                return;
            }

            setSubmitError(null);

            await authClient.requestPasswordReset(
                {
                    email: emailRef.current.value,
                    redirectTo: "/reset-password",
                },
                {
                    onSuccess: () => {
                        router.push("/login");
                    },
                    onError: (ctx) => {
                        setSubmitError(ctx.error.message);
                    },
                },
            );
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Reset your password</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Enter your email below to reset your password
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

                {/* Reset Password Button */}
                <Field>
                    {submitError && (
                        <p className="text-sm font-medium text-destructive">
                            {submitError}
                        </p>
                    )}

                    <Button
                        type="button"
                        onClick={resetPassword}
                        disabled={isPending}
                    >
                        {isPending ? "Resetting password..." : "Reset Password"}
                    </Button>
                </Field>
            </FieldGroup>
        </div>
    );
}
