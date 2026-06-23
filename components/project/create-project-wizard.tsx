"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectGoalsFields } from "@/components/project/projectGoalsFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { ProjectImagePicker } from "./create-project/image-picker";
import { submitProjectForm } from "./create-project/submit-project";
import type {
    CreateProjectFormValue,
    SubmissionStage,
    WizardErrors,
} from "./create-project/types";
import {
    validateWizard,
    validateWizardStep,
    wizardSteps,
} from "./create-project/wizard-config";
import {
    ProjectLongDescriptionField,
    ProjectShortDescriptionField,
    ProjectTitleField,
} from "./create-project/wizard-fields";

export function CreateProjectWizard({
    projectId,
    currency,
}: {
    projectId: string;
    currency: string;
}) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [errors, setErrors] = useState<WizardErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitStage, setSubmitStage] = useState<SubmissionStage | null>(
        null,
    );
    const [uploadProgress, setUploadProgress] = useState(0);
    const busy = submitStage !== null;

    const form = useForm({
        defaultValues: {
            id: projectId,
            title: "",
            shortDescription: "",
            longDescription: "",
            images: [],
            goals: [],
        } as CreateProjectFormValue,
        onSubmit: async ({ value }) => {
            setSubmitError(null);
            const validationErrors = validateWizard(value);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setSubmitError(
                    "Review the highlighted fields before finishing.",
                );
                return;
            }

            const result = await submitProjectForm(value, {
                onStage: setSubmitStage,
                onUploadProgress: setUploadProgress,
            });
            if (!result.ok) {
                setErrors(result.fieldErrors ?? {});
                setSubmitError(result.message);
                setSubmitStage(null);
                setUploadProgress(0);
                return;
            }

            setSubmitStage("Opening project");
            router.replace(`/project/${result.projectId}`);
            router.refresh();
        },
    });

    const next = () => {
        const stepErrors = validateWizardStep(step, form.state.values);
        setErrors(stepErrors);
        if (Object.keys(stepErrors).length > 0) return;
        setSubmitError(null);
        setStep((current) => Math.min(wizardSteps.length - 1, current + 1));
    };

    const previous = () => {
        setErrors({});
        setSubmitError(null);
        setStep((current) => Math.max(0, current - 1));
    };

    const current = wizardSteps[step];

    return (
        <form
            className="flex min-h-[calc(100dvh-4rem)] flex-col"
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (step < wizardSteps.length - 1) next();
                else form.handleSubmit();
            }}
        >
            <main className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6">
                <div className="my-auto w-full max-w-3xl">
                    <header className="mb-5 text-center sm:text-left">
                        <p className="text-sm font-medium text-primary">
                            Create project
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {current.title}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                            {current.description}
                        </p>
                    </header>

                    <Card>
                        <CardHeader className="sr-only">
                            <CardTitle>{current.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-5 sm:p-7">
                            {step === 0 ? (
                                <form.Field name="title">
                                    {(field) => (
                                        <ProjectTitleField
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            disabled={busy}
                                            errors={errors.title}
                                        />
                                    )}
                                </form.Field>
                            ) : null}

                            {step === 1 ? (
                                <form.Field name="shortDescription">
                                    {(field) => (
                                        <ProjectShortDescriptionField
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            disabled={busy}
                                            errors={errors.shortDescription}
                                        />
                                    )}
                                </form.Field>
                            ) : null}

                            {step === 2 ? (
                                <form.Field name="longDescription">
                                    {(field) => (
                                        <ProjectLongDescriptionField
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            disabled={busy}
                                            errors={errors.longDescription}
                                        />
                                    )}
                                </form.Field>
                            ) : null}

                            {step === 3 ? (
                                <form.Field name="images">
                                    {(field) => (
                                        <ProjectImagePicker
                                            value={field.state.value}
                                            onChange={field.handleChange}
                                            disabled={busy}
                                            error={errors.images?.join(" ")}
                                        />
                                    )}
                                </form.Field>
                            ) : null}

                            {step === 4 ? (
                                <form.Field name="goals">
                                    {(field) => (
                                        <ProjectGoalsFields
                                            value={field.state.value}
                                            onChangeAction={field.handleChange}
                                            currency={currency}
                                            disabled={busy}
                                            errors={errors}
                                        />
                                    )}
                                </form.Field>
                            ) : null}

                            {submitError ? (
                                <div
                                    role="alert"
                                    className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                                >
                                    {submitError}
                                </div>
                            ) : null}

                            {submitStage ? (
                                <SubmissionStatus
                                    stage={submitStage}
                                    uploadProgress={uploadProgress}
                                />
                            ) : null}

                            <div className="flex items-center justify-between gap-3 border-t pt-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={previous}
                                    disabled={step === 0 || busy}
                                >
                                    Previous
                                </Button>
                                <Button type="submit" disabled={busy}>
                                    {step === wizardSteps.length - 1
                                        ? "Finish"
                                        : "Next"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <WizardProgress step={step} />
        </form>
    );
}

function SubmissionStatus({
    stage,
    uploadProgress,
}: {
    stage: SubmissionStage;
    uploadProgress: number;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3 text-sm">
            {stage === "Opening project" ? (
                <CheckCircle2 className="size-4 text-primary" />
            ) : (
                <Loader2 className="size-4 animate-spin text-primary" />
            )}
            <span>
                {stage}
                {stage === "Uploading images" && uploadProgress > 0
                    ? ` · ${uploadProgress}%`
                    : ""}
            </span>
        </div>
    );
}

function WizardProgress({ step }: { step: number }) {
    return (
        <div className="sticky bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
            <Progress value={(step + 1) * 20} className="mx-auto max-w-7xl">
                <ProgressLabel>{wizardSteps[step].name}</ProgressLabel>
                <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                    Step {step + 1} of {wizardSteps.length}
                </span>
            </Progress>
        </div>
    );
}
