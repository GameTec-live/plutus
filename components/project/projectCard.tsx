"use client";

import Image from "next/image";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/lib/connected-db-oc/project";

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="relative w-full max-w-sm overflow-hidden pt-0">
            <div className="bg-primary absolute inset-0 z-30 aspect-video opacity-50 mix-blend-color" />
            <Image
                src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Photo by mymind on Unsplash"
                title="Photo by mymind on Unsplash"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
                width={800}
                height={450}
            />
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                    {project.shortDescription || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardFooter className="relative z-20">
                <Field className="w-full max-w-sm">
                    <FieldLabel htmlFor={`progress-${project.id}`}>
                        <span> Funding progress</span>
                        <span className="ml-auto">
                            {project.balance} {project.currency}
                        </span>
                    </FieldLabel>
                    <Progress value={project.balance} id={`progress-${project.id}`} />
                </Field>
            </CardFooter>
        </Card>
    );
}
