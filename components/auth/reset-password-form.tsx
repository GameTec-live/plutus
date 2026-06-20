"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters."),
        confirmPassword: z.string().min(1, "Please confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    token: string;
    onSuccess?: () => void;
}

function getErrorMessage(error: unknown) {
    if (!error) {
        return undefined;
    }

    if (typeof error === "string") {
        return error;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return String(error);
}

export function ResetPasswordForm({
    token,
    onSuccess,
}: ResetPasswordFormProps) {
    const form = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        } satisfies ResetPasswordFormValues,
        validators: {
            onSubmit: resetPasswordSchema,
        },
        onSubmit: async ({ value }) => {
            const res = await authClient.resetPassword({
                newPassword: value.password,
                token,
            });

            if (res.error) {
                toast.error(res.error.message);
                return;
            }

            toast.success("Password reset successfully");
            onSuccess?.();
        },
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
            }}
            className="grid gap-4"
        >
            <FieldGroup>
                <form.Field name="password">
                    {(field) => {
                        const error = getErrorMessage(
                            field.state.meta.errors[0],
                        );
                        const invalid =
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0;

                        return (
                            <Field data-invalid={invalid}>
                                <FieldLabel htmlFor="reset-password">
                                    New password
                                </FieldLabel>
                                <Input
                                    id="reset-password"
                                    name={field.name}
                                    type="password"
                                    placeholder="Enter new password"
                                    aria-invalid={invalid}
                                    autoComplete="new-password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                />
                                {invalid && error ? (
                                    <FieldError>{error}</FieldError>
                                ) : null}
                            </Field>
                        );
                    }}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => {
                        const error = getErrorMessage(
                            field.state.meta.errors[0],
                        );
                        const invalid =
                            field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0;

                        return (
                            <Field data-invalid={invalid}>
                                <FieldLabel htmlFor="reset-confirm-password">
                                    Confirm password
                                </FieldLabel>
                                <Input
                                    id="reset-confirm-password"
                                    name={field.name}
                                    type="password"
                                    placeholder="Confirm new password"
                                    aria-invalid={invalid}
                                    autoComplete="new-password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                />
                                {invalid && error ? (
                                    <FieldError>{error}</FieldError>
                                ) : null}
                            </Field>
                        );
                    }}
                </form.Field>
            </FieldGroup>

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
                {([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            "Reset password"
                        )}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}
