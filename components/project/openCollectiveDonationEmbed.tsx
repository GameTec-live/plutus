"use client";

import { HandCoinsIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { invalidateProjectBalance } from "@/lib/actions/project";

type OpenCollectiveMessage = {
    event?: unknown;
    payload?: {
        order?: {
            id?: unknown;
            legacyId?: unknown;
        };
    };
};

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function OpenCollectiveDonationEmbed({
    projectId,
    projectTitle,
    embedUrl,
    embedOrigin,
}: {
    projectId: string;
    projectTitle: string;
    embedUrl: string | null;
    embedOrigin: string;
}) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const processedOrders = useRef(new Set<string>());

    useEffect(() => {
        if (!embedUrl) {
            return;
        }

        function handleMessage(event: MessageEvent<unknown>) {
            if (
                event.origin !== embedOrigin ||
                event.source !== iframeRef.current?.contentWindow ||
                !isObject(event.data)
            ) {
                return;
            }

            const message = event.data as OpenCollectiveMessage;

            if (message.event !== "success") {
                return;
            }

            const rawOrderId =
                message.payload?.order?.id ??
                message.payload?.order?.legacyId ??
                "completed-contribution";
            const orderId = String(rawOrderId);

            if (processedOrders.current.has(orderId)) {
                return;
            }

            processedOrders.current.add(orderId);
            void invalidateProjectBalance(projectId).catch((error: unknown) => {
                console.error("Failed to refresh project balance cache", error);
            });
        }

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [embedOrigin, embedUrl, projectId]);

    if (!embedUrl) {
        return (
            <section
                className="flex min-h-64 flex-col items-center justify-center rounded-xl border bg-card p-8 text-center shadow-sm"
                aria-labelledby="donation-unavailable-title"
            >
                <HandCoinsIcon
                    className="mb-4 size-10 text-muted-foreground"
                    aria-hidden="true"
                />
                <h2
                    id="donation-unavailable-title"
                    className="text-lg font-semibold"
                >
                    Donations unavailable
                </h2>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    This project is not connected to Open Collective yet.
                </p>
            </section>
        );
    }

    return (
        <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`Open Collective donation form for ${projectTitle}`}
            allow="payment"
            loading="eager"
            width="100%"
            height="1600"
        />
    );
}
