import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { Textarea } from "../ui/textarea";

const bioschema = z.object({
    bio: z.string().max(10000, "The bio can only be 10 000 characters long"),
});

export function BioForm({ currentBio }: { currentBio?: string | null }) {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        defaultValues: { bio: currentBio ?? "" },
        validators: { onSubmit: bioschema },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            const { error } = await authClient.updateUser({
                bio: value.bio === "" ? null : value.bio,
            });
            if (error) {
                setServerError(error.message ?? "Failed to update bio.");
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
                <form.Field name="bio">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Bio
                                </FieldLabel>
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="New bio"
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
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                )}
            </form.Subscribe>
            {serverError && (
                <p className="text-sm text-destructive mt-2">{serverError}</p>
            )}
            {success && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Bio updated.
                </p>
            )}
        </form>
    );
}
