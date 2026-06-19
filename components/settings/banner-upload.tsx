import { useUploadFile } from "@better-upload/client";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function BannerUpload({
    currentBanner,
}: {
    currentBanner?: string | null;
}) {
    const router = useRouter();

    const { upload, isPending } = useUploadFile({
        route: "banner",
        onUploadComplete: () => {
            router.refresh();
        },
    });

    const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone(
        {
            onDrop: (files) => {
                if (files.length > 0 && !isPending) {
                    upload(files[0]);
                }
                if (inputRef.current) inputRef.current.value = "";
            },
            noClick: true,
            accept: { "image/*": [] },
            multiple: false,
        },
    );

    async function handleRemove() {
        if (!currentBanner) return;

        await fetch("/api/upload/banner", {
            method: "DELETE",
        });

        router.refresh();
    }

    const bannerSrc = currentBanner ?? "/images/default-banner.png";

    return (
        <div className="relative h-28 group overflow-hidden">
            {/* Banner image — always shown */}
            <Image
                src={bannerSrc}
                alt="Banner"
                fill
                sizes="100vw"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dropzone overlay — appears on hover */}
            <label
                {...getRootProps()}
                className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-colors",
                    "bg-black/0 group-hover:bg-black/40",
                    {
                        "bg-black/40": isDragActive,
                        "cursor-not-allowed": isPending,
                    },
                )}
            >
                <div
                    className={cn(
                        "flex flex-col items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity",
                        { "opacity-100": isDragActive || isPending },
                    )}
                >
                    {isPending ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <Upload className="size-5" />
                    )}
                    <span className="text-xs font-medium">
                        {isPending
                            ? "Uploading..."
                            : isDragActive
                              ? "Drop image here"
                              : "Click or drag to change banner"}
                    </span>
                </div>

                <input
                    {...getInputProps()}
                    type="file"
                    accept="image/*"
                    disabled={isPending}
                />
            </label>

            {/* Remove button — only shown when there's a custom banner */}
            {currentBanner && (
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    aria-label="Remove banner"
                    className="absolute top-2 right-2 z-10 flex items-center justify-center size-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 disabled:cursor-not-allowed"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}
