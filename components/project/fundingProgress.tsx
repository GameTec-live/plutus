"use client";

import { CheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProjectGoal } from "@/lib/db/queries/project";
import {
    formatCurrencyFromCents,
    getFundingProgressModel,
} from "@/lib/project-goals";
import { cn } from "@/lib/utils";

export function FundingProgress({
    goals,
    balance,
    currency,
    compact = false,
    className,
}: {
    goals: ProjectGoal[];
    balance: number | null;
    currency: string;
    compact?: boolean;
    className?: string;
}) {
    const model = getFundingProgressModel(goals, balance);
    if (!model) return null;

    const balanceLabel =
        model.balanceCents === null
            ? "—"
            : formatCurrencyFromCents(model.balanceCents, currency);
    const targetLabel = formatCurrencyFromCents(model.baseTarget, currency);

    return (
        <div className={cn("w-full", className)}>
            <span className="sr-only">
                Funding progress: {balanceLabel} of {targetLabel}
            </span>
            {!compact && (
                <p className="mb-2 text-sm font-medium">Funding progress</p>
            )}
            <div className="flex flex-col gap-2 min-[24rem]:flex-row min-[24rem]:items-center min-[24rem]:gap-4">
                <div className="relative h-7 min-w-0 flex-1">
                    <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-[width]"
                            style={{ width: `${model.fillPercentage}%` }}
                        />
                    </div>
                    {model.markers.map((marker) => (
                        <Tooltip key={marker.amount}>
                            <TooltipTrigger
                                render={
                                    <button
                                        type="button"
                                        className={cn(
                                            "absolute top-1/2 z-10 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                            marker.completed === false &&
                                                "bg-background text-primary ring-2 ring-primary",
                                        )}
                                        style={{
                                            left: `${marker.position}%`,
                                        }}
                                        aria-label={`${marker.goals.map((goal) => goal.title).join(", ")}: ${formatCurrencyFromCents(marker.amount, currency)}${marker.completed ? ", complete" : ""}`}
                                    />
                                }
                            >
                                {marker.completed && (
                                    <CheckIcon className="size-3" />
                                )}
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="space-y-3">
                                    {marker.goals.map((goal) => (
                                        <div
                                            key={goal.id}
                                            className="max-w-64 space-y-1"
                                        >
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <p className="wrap-anywhere font-medium">
                                                    {goal.title}
                                                </p>
                                                {goal.isStretch && (
                                                    <Badge variant="secondary">
                                                        Stretch goal
                                                    </Badge>
                                                )}
                                                {marker.completed && (
                                                    <Badge>
                                                        <CheckIcon data-icon="inline-start" />
                                                        Complete
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="wrap-anywhere text-muted-foreground">
                                                {goal.description ||
                                                    "No description provided."}
                                            </p>
                                            <p className="font-medium tabular-nums">
                                                {formatCurrencyFromCents(
                                                    goal.amount,
                                                    currency,
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <span className="shrink-0 whitespace-nowrap text-xs font-medium tabular-nums text-muted-foreground sm:text-sm">
                    {balanceLabel} / {targetLabel}
                </span>
            </div>
        </div>
    );
}
