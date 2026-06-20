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

const usernameSchema = z.object({
    username: z.string().min(1, "Username must be at least 1 character."),
});

export function UsernameForm({ currentName }: { currentName: string }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        defaultValues: { username: "" },
        validators: { onSubmit: usernameSchema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            const { error } = await authClient.updateUser({
                name: value.username,
            });
            if (error) {
                setServerError(error.message ?? "Failed to update username.");
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
                <form.Field name="username">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Username
                                </FieldLabel>
                                <FieldDescription>
                                    {currentName}
                                </FieldDescription>
                                <div className="flex gap-2">
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={isInvalid}
                                        placeholder="New username"
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
                <p className="text-sm text-success mt-2">Username updated.</p>
            )}
        </form>
    );
}
