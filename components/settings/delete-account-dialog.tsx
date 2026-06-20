import { useForm } from "@tanstack/react-form";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const deleteSchema = z.object({
    confirmText: z.string().refine((v) => v === "delete my account", {
        message: 'Please type "delete my account" to confirm.',
    }),
});

export function DeleteAccountDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: { confirmText: "" },
        validators: { onSubmit: deleteSchema },
        onSubmit: async () => {
            setServerError(null);
            const { error } = await authClient.deleteUser({ callbackURL: "/" });
            if (error) {
                setServerError(error.message ?? "Failed to delete account.");
            } else {
                setOpen(false);
                router.push("/");
            }
        },
    });

    return (
        <AlertDialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) form.reset();
            }}
        >
            <AlertDialogTrigger
                render={
                    <Button variant="destructive" size="sm">
                        <Trash2 className="size-3.5" />
                        Delete Account
                    </Button>
                }
            />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete account permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. All your data will be
                        permanently deleted. Type{" "}
                        <span className="font-semibold text-foreground">
                            delete my account
                        </span>{" "}
                        to confirm.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <form.Field name="confirmText">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;
                            return (
                                <Field data-invalid={isInvalid}>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={isInvalid}
                                        placeholder="delete my account"
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

                    {serverError && (
                        <p className="text-sm text-destructive mt-2">
                            {serverError}
                        </p>
                    )}

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <form.Subscribe
                            selector={(state) => [
                                state.canSubmit,
                                state.isSubmitting,
                            ]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Deleting..."
                                        : "Delete Account"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
