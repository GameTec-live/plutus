import { deleteObject } from "@better-upload/server/helpers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { s3 } from "@/lib/s3";

export async function DELETE() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const currentBanner = (session.user as { bannerImage?: string | null })
        .bannerImage;

    if (currentBanner) {
        try {
            const key = currentBanner.replace(`${env.S3_PUBLIC_URL}/`, "");
            await deleteObject(s3, { bucket: env.S3_BUCKETNAME, key });
        } catch {}
    }

    await auth.api.updateUser({
        headers: await headers(),
        body: { bannerImage: null },
    });

    return NextResponse.json({ success: true });
}
