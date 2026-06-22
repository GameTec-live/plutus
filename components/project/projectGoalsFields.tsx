"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectGoalFormValue } from "@/lib/db/queries/project";
import { normalizeCurrency, validateProjectGoals } from "@/lib/project-goals";

function createGoal(): ProjectGoalFormValue {
    return {
        clientId: crypto.randomUUID(),
        title: "",
        description: "",
        amount: "",
        isStretch: false,
        isPrimary: false,
    };
}

export function ProjectGoalsFields({
    value,
    onChangeAction,
    currency = "EUR",
    disabled = false,
    errors = {},
}: {
    value: ProjectGoalFormValue[];
    onChangeAction: (goals: ProjectGoalFormValue[]) => void;
    currency?: string;
    disabled?: boolean;
    errors?: Record<string, string[]>;
}) {
    const validation = validateProjectGoals(value);
    const localErrors = validation.errors;
    const allErrors = { ...localErrors, ...errors };

    const updateGoal = (
        index: number,
        update: Partial<ProjectGoalFormValue>,
    ) => {
        const next = value.map((goal, goalIndex) =>
            goalIndex === index ? { ...goal, ...update } : goal,
        );
        onChangeAction(next);
    };

    const setPrimary = (index: number, checked: boolean) => {
        onChangeAction(
            value.map((goal, goalIndex) => ({
                ...goal,
                isPrimary: goalIndex === index ? checked : false,
                isStretch:
                    goalIndex === index && checked ? false : goal.isStretch,
            })),
        );
    };

    const fieldErrors = (index: number, field: string) =>
        allErrors[`${index}.${field}`] ??
        allErrors[`goals.${index}.${field}`] ??
        [];

    return (
        <FieldSet disabled={disabled} className="gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="font-medium">Funding goals</h3>
                    <FieldDescription>
                        Add milestones that supporters can track as funding
                        grows.
                    </FieldDescription>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChangeAction([...value, createGoal()])}
                    disabled={disabled}
                >
                    <PlusIcon data-icon="inline-start" />
                    Add goal
                </Button>
            </div>

            {value.length === 0 && (
                <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
                    No funding goals added.
                </div>
            )}

            {value.map((goal, index) => {
                const prefix = `goal-${goal.clientId}`;
                return (
                    <div
                        key={goal.clientId}
                        className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2"
                    >
                        <div className="flex items-center justify-between gap-3 sm:col-span-2">
                            <p className="text-sm font-medium">
                                Goal {index + 1}
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Remove goal ${index + 1}`}
                                onClick={() =>
                                    onChangeAction(
                                        value.filter(
                                            (_, goalIndex) =>
                                                goalIndex !== index,
                                        ),
                                    )
                                }
                                disabled={disabled}
                            >
                                <Trash2Icon />
                            </Button>
                        </div>

                        <Field
                            data-invalid={
                                fieldErrors(index, "title").length > 0
                            }
                        >
                            <FieldLabel htmlFor={`${prefix}-title`}>
                                Title
                            </FieldLabel>
                            <Input
                                id={`${prefix}-title`}
                                value={goal.title}
                                onChange={(event) =>
                                    updateGoal(index, {
                                        title: event.target.value,
                                    })
                                }
                                aria-invalid={
                                    fieldErrors(index, "title").length > 0
                                }
                                placeholder="Launch the first release"
                                disabled={disabled}
                            />
                            <FieldError>
                                {fieldErrors(index, "title").join(" ")}
                            </FieldError>
                        </Field>

                        <Field
                            data-invalid={
                                fieldErrors(index, "amount").length > 0
                            }
                        >
                            <FieldLabel htmlFor={`${prefix}-amount`}>
                                Amount
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id={`${prefix}-amount`}
                                    inputMode="decimal"
                                    value={goal.amount}
                                    onChange={(event) =>
                                        updateGoal(index, {
                                            amount: event.target.value,
                                        })
                                    }
                                    aria-invalid={
                                        fieldErrors(index, "amount").length > 0
                                    }
                                    placeholder="1000.00"
                                    disabled={disabled}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>
                                        {normalizeCurrency(currency)}
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError>
                                {fieldErrors(index, "amount").join(" ")}
                            </FieldError>
                        </Field>

                        <Field
                            className="sm:col-span-2"
                            data-invalid={
                                fieldErrors(index, "description").length > 0
                            }
                        >
                            <div className="flex items-center justify-between gap-3">
                                <FieldLabel htmlFor={`${prefix}-description`}>
                                    Description
                                </FieldLabel>
                                <span className="text-xs tabular-nums text-muted-foreground">
                                    {goal.description.length}/200
                                </span>
                            </div>
                            <Textarea
                                id={`${prefix}-description`}
                                value={goal.description}
                                onChange={(event) =>
                                    updateGoal(index, {
                                        description: event.target.value,
                                    })
                                }
                                maxLength={200}
                                aria-invalid={
                                    fieldErrors(index, "description").length > 0
                                }
                                placeholder="A short explanation of what this funding unlocks."
                                disabled={disabled}
                            />
                            <FieldError>
                                {fieldErrors(index, "description").join(" ")}
                            </FieldError>
                        </Field>

                        <Field orientation="horizontal">
                            <Checkbox
                                id={`${prefix}-stretch`}
                                checked={goal.isStretch}
                                onCheckedChange={(checked) =>
                                    updateGoal(index, {
                                        isStretch: checked,
                                        isPrimary: checked
                                            ? false
                                            : goal.isPrimary,
                                    })
                                }
                                disabled={disabled}
                            />
                            <div>
                                <FieldLabel htmlFor={`${prefix}-stretch`}>
                                    Stretch goal
                                </FieldLabel>
                                <FieldDescription>
                                    An additional milestone beyond base funding.
                                </FieldDescription>
                            </div>
                        </Field>

                        <Field orientation="horizontal">
                            <Checkbox
                                id={`${prefix}-primary`}
                                checked={goal.isPrimary}
                                onCheckedChange={(checked) =>
                                    setPrimary(index, checked)
                                }
                                disabled={disabled || goal.isStretch}
                            />
                            <div>
                                <FieldLabel htmlFor={`${prefix}-primary`}>
                                    Primary goal
                                </FieldLabel>
                                <FieldDescription>
                                    Used as the base target in the counter.
                                </FieldDescription>
                            </div>
                        </Field>
                    </div>
                );
            })}

            {(allErrors.goals ?? []).length > 0 && (
                <FieldError>{allErrors.goals.join(" ")}</FieldError>
            )}
        </FieldSet>
    );
}
