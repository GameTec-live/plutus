"use client";

import { useForm } from "@tanstack/react-form";
import { Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import * as z from "zod";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

// ---- Schemas ----

const usernameSchema = z.object({
    username: z.string().min(1, "Username must be at least 1 character."),
});

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
});

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

const deleteSchema = z.object({
    confirmText: z.string().refine((v) => v === "delete my account", {
        message: 'Please type "delete my account" to confirm.',
    }),
});

// ---- Section wrapper ----

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="space-y-4 scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {title}
            </p>
            {children}
        </section>
    );
}

// ---- Username form ----

function UsernameForm({ currentName }: { currentName: string }) {
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
                                    Current:{" "}
                                    <span className="font-medium text-foreground">
                                        {currentName}
                                    </span>
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
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="shrink-0"
                                    >
                                        Save
                                    </Button>
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
                    Username updated.
                </p>
            )}
        </form>
    );
}

// ---- Email form ----

function EmailForm({ currentEmail }: { currentEmail: string }) {
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
                                    Current:{" "}
                                    <span className="font-medium text-foreground">
                                        {currentEmail}
                                    </span>
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
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="shrink-0"
                                    >
                                        Update
                                    </Button>
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

// ---- Password form ----

function PasswordForm() {
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

            <Button type="submit" size="sm" className="mt-4">
                Change Password
            </Button>

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

// ---- Delete account dialog ----

function DeleteAccountDialog() {
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
                        <AlertDialogAction variant="destructive" type="submit">
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ---- Avatar upload ----

function AvatarUpload({
    name,
    image,
}: {
    name: string;
    image?: string | null;
}) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setSuccess(false);

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }

        const img = document.createElement("img");
        const url = URL.createObjectURL(file);

        img.onload = async () => {
            URL.revokeObjectURL(url);
            if (img.width > 512 || img.height > 512) {
                setError("Image must be 512×512 pixels or smaller.");
                return;
            }
            const reader = new FileReader();
            reader.onload = async () => {
                const dataUrl = reader.result as string;
                setLoading(true);
                const { error: apiError } = await authClient.updateUser({
                    image: dataUrl,
                });
                setLoading(false);
                if (apiError) {
                    setError(apiError.message ?? "Failed to update avatar.");
                } else {
                    setPreview(dataUrl);
                    setSuccess(true);
                    router.refresh();
                }
            };
            reader.readAsDataURL(file);
        };
        img.src = url;
    }

    return (
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Avatar className="size-20 ring-4 ring-card bg-muted">
                    <AvatarImage
                        src={preview ?? image ?? undefined}
                        alt={name}
                    />
                    <AvatarFallback className="text-xl">
                        {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    aria-label="Change avatar"
                >
                    <Upload className="size-5 text-white" />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
            <div className="flex flex-col gap-1">
                <p className="-mt-2 text-2xl font-bold text-white tracking-tight">
                    {name}
                </p>
                {error && <p className="text-xs text-destructive">{error}</p>}
                {success && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                        Avatar updated.
                    </p>
                )}
            </div>
        </div>
    );
}

// ---- Main export ----

export function SettingsForm({
    name,
    email,
    image,
}: {
    name: string;
    email: string;
    image?: string | null;
}) {
    return (
        <div className="ring-foreground/10 bg-card text-card-foreground rounded-xl ring-1 overflow-hidden">
            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-muted to-muted/60" />

            {/* Avatar + delete row */}
            <div className="px-6 pb-4 -mt-12 flex items-end justify-between">
                <AvatarUpload name={name} image={image} />
                <DeleteAccountDialog />
            </div>

            <div className="px-6 pb-8 space-y-8">
                <Separator />

                {/* General */}
                <Section id="general" title="General">
                    <UsernameForm currentName={name} />
                    <Separator className="my-2" />
                    <EmailForm currentEmail={email} />
                    <Separator className="my-2" />
                    <PasswordForm />
                </Section>

                <Separator />

                {/* 2FA */}
                <Section id="2fa" title="Authentication">
                    <Field>
                        <FieldLabel>Two-Factor Authentication</FieldLabel>
                        <FieldDescription>2FA is not active.</FieldDescription>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-fit mt-1"
                            disabled
                        >
                            Manage 2FA Methods
                        </Button>
                        <FieldDescription>
                            Two-factor authentication settings coming soon.
                        </FieldDescription>
                    </Field>
                </Section>
            </div>
        </div>
    );
}
