import { useForm } from "@tanstack/react-form";
import { useState } from "react";
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

const passwordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Please enter your current password."),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters."),
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export function PasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validators: { onSubmit: passwordSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            const { error } = await authClient.changePassword({
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
                revokeOtherSessions: false,
            });
            if (error) {
                setServerError(error.message ?? "Failed to change password.");
            } else {
                setSuccess(true);
                form.reset();
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldGroup>
                <form.Field name="currentPassword">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Current Password
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="Current password"
                                />
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                </form.Field>

                <form.Field name="newPassword">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    New Password
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="New password"
                                />
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </Field>
                        );
                    }}
                </form.Field>

                <form.Field name="confirmPassword">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Confirm New Password
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="Confirm new password"
                                />
                                {isInvalid && (
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                )}
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
                        size="sm"
                        className="mt-4"
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? "Changing..." : "Change Password"}
                    </Button>
                )}
            </form.Subscribe>

            {serverError && (
                <p className="text-sm text-destructive mt-2">{serverError}</p>
            )}
            {success && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Password changed successfully.
                </p>
            )}
        </form>
    );
}
