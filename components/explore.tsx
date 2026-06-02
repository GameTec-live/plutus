"use client";

import type * as React from "react";
import { CardWrapper } from "@/components/cardGrid";
import { ProjectCardExample } from "@/components/projectCard";

export function Explore({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <CardWrapper className={className} {...props}>
            <ProjectCardExample />
            <ProjectCardExample />
            <ProjectCardExample />
            <ProjectCardExample />
            <ProjectCardExample />
        </CardWrapper>
    );
}
