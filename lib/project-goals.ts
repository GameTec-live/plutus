import type {
    ProjectGoal,
    ProjectGoalFormValue,
} from "@/lib/db/queries/project";

const amountPattern = /^\d+(?:\.\d{1,2})?$/;

export function parseAmountToCents(value: string): number | null {
    const normalized = value.trim();
    if (!amountPattern.test(normalized)) return null;

    const [whole, fraction = ""] = normalized.split(".");
    const cents = BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
    if (cents <= BigInt(0) || cents > BigInt(Number.MAX_SAFE_INTEGER)) {
        return null;
    }

    return Number(cents);
}

export function validateProjectGoals(goals: ProjectGoalFormValue[]) {
    const errors: Record<string, string[]> = {};
    const addError = (path: string, message: string) => {
        errors[path] = [...(errors[path] ?? []), message];
    };

    const normalizedGoals = goals.map((goal, index) => {
        if (!goal.clientId)
            addError(`${index}.clientId`, "Goal ID is required.");
        if (!goal.title.trim()) {
            addError(`${index}.title`, "Goal title is required.");
        }
        if (!goal.description.trim()) {
            addError(`${index}.description`, "Goal description is required.");
        } else if (goal.description.trim().length > 200) {
            addError(
                `${index}.description`,
                "Goal description must be 200 characters or fewer.",
            );
        }
        const amount = parseAmountToCents(goal.amount);
        if (amount === null) {
            addError(
                `${index}.amount`,
                "Enter a positive amount with no more than two decimal places.",
            );
        }
        if (goal.isStretch && goal.isPrimary) {
            addError(
                `${index}.isPrimary`,
                "A stretch goal cannot be the primary goal.",
            );
        }

        if (amount === null) return null;
        return {
            title: goal.title.trim(),
            description: goal.description.trim(),
            amount,
            isStretch: goal.isStretch,
            isPrimary: goal.isPrimary,
        };
    });

    if (goals.filter((goal) => goal.isPrimary).length > 1) {
        addError("goals", "Only one primary goal may be selected.");
    }

    return {
        errors,
        goals: normalizedGoals.filter((goal) => goal !== null),
    };
}

export function getFundingProgressModel(
    goals: ProjectGoal[],
    balanceInCents: number | null,
) {
    const validGoals = goals.filter(
        (goal) => Number.isSafeInteger(goal.amount) && goal.amount > 0,
    );
    if (validGoals.length === 0) return null;

    const nonStretchGoals = validGoals.filter((goal) => !goal.isStretch);
    const primaryGoal = nonStretchGoals.find((goal) => goal.isPrimary);
    const baseTarget =
        primaryGoal?.amount ??
        Math.max(
            ...(nonStretchGoals.length > 0 ? nonStretchGoals : validGoals).map(
                (goal) => goal.amount,
            ),
        );
    const visualMaximum = Math.max(...validGoals.map((goal) => goal.amount));
    const balanceCents =
        balanceInCents === null || !Number.isFinite(balanceInCents)
            ? null
            : Math.round(balanceInCents);
    const fillPercentage =
        balanceCents === null
            ? 0
            : Math.min(100, Math.max(0, (balanceCents / visualMaximum) * 100));

    const groupedGoals = new Map<number, ProjectGoal[]>();
    for (const goal of validGoals) {
        const group = groupedGoals.get(goal.amount) ?? [];
        group.push(goal);
        groupedGoals.set(goal.amount, group);
    }

    const markers = [...groupedGoals.entries()]
        .sort(([amountA], [amountB]) => amountA - amountB)
        .map(([amount, grouped]) => ({
            amount,
            position: (amount / visualMaximum) * 100,
            completed: balanceCents === null ? null : balanceCents >= amount,
            goals: grouped,
        }));

    return {
        baseTarget,
        visualMaximum,
        balanceCents,
        fillPercentage,
        markers,
    };
}

export function normalizeCurrency(currency: string | null | undefined) {
    const normalized = currency?.trim().toUpperCase();
    return normalized && /^[A-Z]{3}$/.test(normalized) ? normalized : "EUR";
}

export function formatCurrencyFromCents(amount: number, currency: string) {
    const safeCurrency = normalizeCurrency(currency);
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: safeCurrency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount / 100);
    } catch {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount / 100);
    }
}
