"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ProjectMarkdown } from "./project-markdown";

export function MarkdownEditor({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    const [tab, setTab] = useState<"write" | "preview">("write");

    return (
        <div className="overflow-hidden rounded-lg border bg-background">
            <div className="flex gap-1 border-b bg-muted/40 p-1" role="tablist">
                <Button
                    type="button"
                    size="sm"
                    variant={tab === "write" ? "secondary" : "ghost"}
                    role="tab"
                    aria-selected={tab === "write"}
                    onClick={() => setTab("write")}
                    disabled={disabled}
                >
                    Write
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={tab === "preview" ? "secondary" : "ghost"}
                    role="tab"
                    aria-selected={tab === "preview"}
                    onClick={() => setTab("preview")}
                    disabled={disabled}
                >
                    Preview
                </Button>
            </div>
            <div
                role="tabpanel"
                className={cn(tab === "write" ? "block" : "hidden")}
            >
                <Textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                    placeholder="Tell supporters about the problem, your approach, and how funding will help. Markdown is supported."
                    className="min-h-72 resize-y rounded-none border-0 shadow-none focus-visible:ring-0"
                    maxLength={20_000}
                />
            </div>
            <div
                role="tabpanel"
                className={cn(
                    "min-h-72 p-4",
                    tab === "preview" ? "block" : "hidden",
                )}
            >
                {value.trim() ? (
                    <ProjectMarkdown>{value}</ProjectMarkdown>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Nothing to preview yet.
                    </p>
                )}
            </div>
        </div>
    );
}
