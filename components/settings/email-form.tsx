import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const emailSchema = z.object({
    email: z.email("Please enter a valid email address."),
});

export function EmailForm({ currentEmail }: { currentEmail: string }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        defaultValues: { email: "" },
        validators: { onSubmit: emailSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            const { error } = await authClient.changeEmail({
                newEmail: value.email,
                callbackURL: "/settings",
            });
            if (error) {
                setServerError(error.message ?? "Failed to update email.");
            } else {
                setSuccess(true);
                form.reset();
                router.refresh();
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
                <form.Field name="email">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    E-Mail
                                </FieldLabel>
                                <FieldDescription>
                                    {currentEmail}
                                </FieldDescription>
                                <div className="flex gap-2">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="email"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={isInvalid}
                                        placeholder="New email address"
                                    />
                                    <form.Subscribe
                                        selector={(state) => [
                                            state.canSubmit,
                                            state.isSubmitting,
                                        ]}
                                    >
                                        {([canSubmit, isSubmitting]) => (
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="shrink-0"
                                                disabled={
                                                    !canSubmit || isSubmitting
                                                }
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : "Save"}
                                            </Button>
                                        )}
                                    </form.Subscribe>
                                </div>
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
            {serverError && (
                <p className="text-sm text-destructive mt-2">{serverError}</p>
            )}
            {success && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Verification email sent. Please check your inbox.
                </p>
            )}
        </form>
    );
}
