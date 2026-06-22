"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { cacheTags } from "@/lib/cache-tags";

export async function invalidateProjectBalance(projectId: string) {
    if (!z.uuid().safeParse(projectId).success) {
        return;
    }

    revalidateTag(cacheTags.openCollective.projectBalance(projectId), "max");
    revalidateTag(cacheTags.projects.grid, "max");
}
