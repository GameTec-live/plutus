"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "./avatar-upload";
import { BannerUpload } from "./banner-upload";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./passwort-form";
import { Section } from "./section";
import { UsernameForm } from "./user-form";

export function SettingsForm({
    name,
    email,
    image,
    bannerImage,
}: {
    name: string;
    email: string;
    image?: string | null;
    bannerImage?: string | null;
}) {
    return (
        <div className="ring-foreground/10 bg-card text-card-foreground rounded-xl ring-1 overflow-hidden">
            {/* Banner */}
            <BannerUpload currentBanner={bannerImage} />

            {/* Avatar + delete row — stacks on mobile */}
            <div className="px-4 sm:px-6 pb-4 -mt-12 flex flex-wrap items-end justify-between gap-3">
                <AvatarUpload name={name} image={image} />
                <DeleteAccountDialog />
            </div>

            <div className="px-4 sm:px-6 pb-8 space-y-8">
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
