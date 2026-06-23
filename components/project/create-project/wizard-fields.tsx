"use client";

import { MarkdownEditor } from "@/components/project/markdown-editor";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    PROJECT_LONG_DESCRIPTION_MAX,
    PROJECT_SHORT_DESCRIPTION_MAX,
    PROJECT_TITLE_MAX,
} from "@/lib/project-creation";

function CharacterCount({
    value,
    maximum,
}: {
    value: string;
    maximum: number;
}) {
    return (
        <span className="text-xs tabular-nums text-muted-foreground">
            {value.length.toLocaleString()}/{maximum.toLocaleString()}
        </span>
    );
}

export function ProjectTitleField({
    value,
    onChange,
    disabled,
    errors,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    errors?: string[];
}) {
    return (
        <Field data-invalid={Boolean(errors)}>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor="project-title">Project name</FieldLabel>
                <CharacterCount value={value} maximum={PROJECT_TITLE_MAX} />
            </div>
            <Input
                id="project-title"
                autoFocus
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                maxLength={PROJECT_TITLE_MAX}
                placeholder="Community solar workshop"
                aria-invalid={Boolean(errors)}
            />
            <FieldDescription>
                This name will also identify the project on Open Collective.
            </FieldDescription>
            {errors ? <FieldError>{errors.join(" ")}</FieldError> : null}
        </Field>
    );
}

export function ProjectShortDescriptionField({
    value,
    onChange,
    disabled,
    errors,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    errors?: string[];
}) {
    return (
        <Field data-invalid={Boolean(errors)}>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor="project-short-description">
                    Short description
                </FieldLabel>
                <CharacterCount
                    value={value}
                    maximum={PROJECT_SHORT_DESCRIPTION_MAX}
                />
            </div>
            <Textarea
                id="project-short-description"
                autoFocus
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                maxLength={PROJECT_SHORT_DESCRIPTION_MAX}
                className="min-h-36"
                placeholder="What is the project and who will it help?"
                aria-invalid={Boolean(errors)}
            />
            {errors ? <FieldError>{errors.join(" ")}</FieldError> : null}
        </Field>
    );
}

export function ProjectLongDescriptionField({
    value,
    onChange,
    disabled,
    errors,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    errors?: string[];
}) {
    return (
        <Field data-invalid={Boolean(errors)}>
            <div className="flex items-center justify-between gap-3">
                <FieldLabel>Detailed description</FieldLabel>
                <CharacterCount
                    value={value}
                    maximum={PROJECT_LONG_DESCRIPTION_MAX}
                />
            </div>
            <MarkdownEditor
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
            {errors ? <FieldError>{errors.join(" ")}</FieldError> : null}
        </Field>
    );
}
