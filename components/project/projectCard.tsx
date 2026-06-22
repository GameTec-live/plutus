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
import type { Project } from "@/lib/connected-db-oc/project";
import { FundingProgress } from "./fundingProgress";

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
                {project.goals.length > 0 && (
                    <CardFooter className="relative z-20">
                        <FundingProgress
                            goals={project.goals}
                            balance={project.balance}
                            currency={project.currency}
                            compact
                        />
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}
