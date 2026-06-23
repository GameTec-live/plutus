"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isOwnedProjectImageKey } from "@/lib/project-creation";
import { deleteProjectImageKeys } from "@/lib/project-image-storage";

export async function discardProjectUploads(input: {
    projectId: string;
    keys: string[];
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { ok: false as const };

    const ownedKeys = input.keys.filter((key) =>
        isOwnedProjectImageKey(key, session.user.id, input.projectId),
    );
    await deleteProjectImageKeys(ownedKeys);
    return { ok: true as const };
}
