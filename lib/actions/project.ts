"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { cacheTags } from "@/lib/cache-tags";

export async function invalidateProjectBalance(projectId: string) {
    if (!z.uuid().safeParse(projectId).success) {
        return;
    }

    updateTag(cacheTags.openCollective.projectBalance(projectId));
    updateTag(cacheTags.projects.grid);
}
