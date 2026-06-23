"use client";

import { ImagePlus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
    PROJECT_IMAGE_MAX_COUNT,
    PROJECT_IMAGE_MAX_SIZE,
    PROJECT_IMAGE_TYPES,
} from "@/lib/project-creation";
import { cn } from "@/lib/utils";
import type { WizardImage } from "./types";

export function ProjectImagePicker({
    value,
    onChange,
    disabled,
    error,
}: {
    value: WizardImage[];
    onChange: (images: WizardImage[]) => void;
    disabled: boolean;
    error?: string;
}) {
    const imagesRef = useRef(value);
    const [pickerError, setPickerError] = useState<string | null>(null);

    useEffect(() => {
        imagesRef.current = value;
    }, [value]);

    useEffect(
        () => () => {
            for (const image of imagesRef.current) {
                URL.revokeObjectURL(image.previewUrl);
            }
        },
        [],
    );

    const addFiles = (files: File[]) => {
        if (disabled) return;
        const remaining = PROJECT_IMAGE_MAX_COUNT - value.length;
        const valid = files
            .filter(
                (file) =>
                    PROJECT_IMAGE_TYPES.includes(file.type as never) &&
                    file.size <= PROJECT_IMAGE_MAX_SIZE,
            )
            .slice(0, Math.max(0, remaining));
        if (files.length > remaining) {
            setPickerError(
                `Choose no more than ${PROJECT_IMAGE_MAX_COUNT} images.`,
            );
        } else {
            setPickerError(null);
        }
        onChange([
            ...value,
            ...valid.map((file, index) => ({
                clientId: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file),
                isPrimary: value.length === 0 && index === 0,
            })),
        ]);
    };

    const dropzone = useDropzone({
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/gif": [".gif"],
        },
        maxSize: PROJECT_IMAGE_MAX_SIZE,
        multiple: true,
        noClick: true,
        noKeyboard: true,
        disabled,
        onDrop: (acceptedFiles, rejectedFiles) => {
            setPickerError(
                rejectedFiles.length > 0
                    ? "Some files were rejected. Use JPEG, PNG, WebP, or GIF images up to 5 MB."
                    : null,
            );
            addFiles(acceptedFiles);
        },
    });

    const remove = (clientId: string) => {
        const removed = value.find((image) => image.clientId === clientId);
        if (removed) URL.revokeObjectURL(removed.previewUrl);
        const remaining = value.filter((image) => image.clientId !== clientId);
        if (removed?.isPrimary && remaining.length > 0) {
            remaining[0] = { ...remaining[0], isPrimary: true };
        }
        onChange(remaining);
    };

    const setPrimary = (clientId: string) => {
        onChange(
            value.map((image) => ({
                ...image,
                isPrimary: image.clientId === clientId,
            })),
        );
    };

    return (
        <div className="space-y-4">
            <div
                {...dropzone.getRootProps()}
                className={cn(
                    "flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition",
                    dropzone.isDragActive && "border-primary bg-primary/5",
                    disabled && "cursor-not-allowed opacity-60",
                )}
            >
                <input {...dropzone.getInputProps()} />
                <ImagePlus className="mb-3 size-8 text-muted-foreground" />
                <p className="font-medium">Drop project images here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    JPEG, PNG, WebP, or GIF ·{" "}
                    {Math.round(PROJECT_IMAGE_MAX_SIZE / (1024 * 1024))} MB each
                    · {value.length}/{PROJECT_IMAGE_MAX_COUNT}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={dropzone.open}
                    disabled={
                        disabled || value.length >= PROJECT_IMAGE_MAX_COUNT
                    }
                >
                    Choose images
                </Button>
            </div>

            {error || pickerError ? (
                <FieldError>{error ?? pickerError}</FieldError>
            ) : null}

            {value.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    {value.map((image) => (
                        <div
                            key={image.clientId}
                            className={cn(
                                "overflow-hidden rounded-xl border bg-background",
                                image.isPrimary &&
                                    "border-primary ring-1 ring-primary",
                            )}
                        >
                            <div className="relative aspect-video bg-muted">
                                <Image
                                    src={image.previewUrl}
                                    alt={image.file.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                {image.isPrimary ? (
                                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                        <Star className="size-3 fill-current" />
                                        Primary
                                    </span>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between gap-2 p-2">
                                <span className="min-w-0 truncate text-xs text-muted-foreground">
                                    {image.file.name}
                                </span>
                                <div className="flex shrink-0 gap-1">
                                    {!image.isPrimary ? (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                setPrimary(image.clientId)
                                            }
                                            disabled={disabled}
                                        >
                                            Set primary
                                        </Button>
                                    ) : null}
                                    <Button
                                        type="button"
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => remove(image.clientId)}
                                        disabled={disabled}
                                        aria-label={`Remove ${image.file.name}`}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
