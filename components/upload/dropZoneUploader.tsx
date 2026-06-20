"use client"; // only for Next.js

import { useUploadFiles } from "@better-upload/client";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

export function DropZoneUploader() {
    const { control } = useUploadFiles({
        route: "projectImages",
    });

    return (
        <UploadDropzone
            control={control}
            accept="image/*"
            description={{
                maxFileSize: "5MB",
                fileTypes: "JPEG, PNG, GIF",
            }}
        />
    );
}
