"use client"; // only for Next.js

import { useUploadFiles } from "@better-upload/client";
import { UploadDropzone } from "@/components/ui/upload-dropzone";

export function DropZoneUploader() {
    const { control } = useUploadFiles({
        route: "images",
    });

    return (
        <UploadDropzone
            control={control}
            accept="image/*"
            description={{
                maxFiles: 4,
                maxFileSize: "5MB",
                fileTypes: "JPEG, PNG, GIF",
            }}
        />
    );
}
