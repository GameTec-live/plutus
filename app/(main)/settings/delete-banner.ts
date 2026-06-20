"use server";

import { deleteObject } from "@better-upload/server/helpers";
import { headers } from "next/headers";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { s3 } from "@/lib/s3";

export async function deleteBanner() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const currentBanner = session.user.bannerImage;

    if (currentBanner) {
        try {
            const key = currentBanner.split("/").slice(-1)[0];
            await deleteObject(s3, { bucket: env.S3_BUCKETNAME, key });
        } catch (error) {
            console.error(
                "Error occurred while deleting old banner image.",
                error,
            );
        }
    }

    await auth.api.updateUser({
        headers: await headers(),
        body: { bannerImage: null },
    });
}
