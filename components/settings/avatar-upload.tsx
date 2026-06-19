import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export function AvatarUpload({
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
        <div className="flex flex-col gap-2">
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
            {error && <p className="text-xs text-destructive">{error}</p>}
            {success && (
                <p className="text-xs text-green-600 dark:text-green-400">
                    Avatar updated
                </p>
            )}
        </div>
    );
}
