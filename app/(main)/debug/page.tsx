"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function DebugPage() {
    const { data: session, isPending, refetch } = authClient.useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSignUp() {
        setIsSubmitting(true);
        setMessage(null);

        const { error } = await authClient.signUp.email(
            {
                name,
                email,
                password,
            },
            {
                onSuccess: async () => {
                    setMessage("Signed up successfully.");
                    await refetch();
                },
                onError: (ctx) => {
                    setMessage(ctx.error.message || "Sign up failed.");
                },
            },
        );

        if (error) {
            setMessage(error.message || "Sign up failed.");
        }

        setIsSubmitting(false);
    }

    async function handleSignIn() {
        setIsSubmitting(true);
        setMessage(null);

        const { error } = await authClient.signIn.email(
            {
                email,
                password,
            },
            {
                onSuccess: async () => {
                    setMessage("Signed in successfully.");
                    await refetch();
                },
                onError: (ctx) => {
                    setMessage(ctx.error.message || "Sign in failed.");
                },
            },
        );

        if (error) {
            setMessage(error.message || "Sign in failed.");
        }

        setIsSubmitting(false);
    }

    async function handleSignOut() {
        setIsSubmitting(true);
        setMessage(null);

        const { error } = await authClient.signOut({
            fetchOptions: {
                onSuccess: async () => {
                    setMessage("Signed out successfully.");
                    await refetch();
                },
                onError: (ctx) => {
                    setMessage(ctx.error.message || "Sign out failed.");
                },
            },
        });

        if (error) {
            setMessage(error.message || "Sign out failed.");
        }

        setIsSubmitting(false);
    }

    return (
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Auth Debug</CardTitle>
                    <CardDescription>
                        Simple session controls for Better Auth.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label
                            className="text-sm font-medium"
                            htmlFor="debug-name"
                        >
                            Name
                        </label>
                        <Input
                            id="debug-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-sm font-medium"
                            htmlFor="debug-email"
                        >
                            Email
                        </label>
                        <Input
                            id="debug-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-sm font-medium"
                            htmlFor="debug-password"
                        >
                            Password
                        </label>
                        <Input
                            id="debug-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="password"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button disabled={isSubmitting} onClick={handleSignUp}>
                            Sign up
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSignIn}
                            variant="outline"
                        >
                            Sign in
                        </Button>
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSignOut}
                            variant="destructive"
                        >
                            Sign out
                        </Button>
                    </div>

                    <div className="space-y-1 rounded-lg border p-3 text-sm">
                        <div>
                            <span className="font-medium">Session state:</span>{" "}
                            {isPending
                                ? "Loading..."
                                : session
                                  ? "Authenticated"
                                  : "Signed out"}
                        </div>
                        {session ? (
                            <>
                                <div>
                                    <span className="font-medium">User:</span>{" "}
                                    {session.user.name}
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span>{" "}
                                    {session.user.email}
                                </div>
                            </>
                        ) : null}
                        {message ? (
                            <div>
                                <span className="font-medium">Status:</span>{" "}
                                {message}
                            </div>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
