"use client";

import Image from "next/image";
import Link from "next/link";
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
        <Link href={`/project/${project.id}`}>
            <Card className="relative w-full max-w-sm overflow-hidden pt-0">
                <Image
                    src={
                        project.projectMainImage || "/images/default-banner.png"
                    }
                    alt={project.title}
                    className="relative z-20 aspect-video w-full object-cover "
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
                        <Progress
                            value={project.balance}
                            id={`progress-${project.id}`}
                        />
                    </Field>
                </CardFooter>
            </Card>
        </Link>
    );
}
