import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib";
import { auth } from "@/lib/auth";
import { user } from "../schema";

export async function getPublicUserById(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("No session found");
    }

    const [userData] = await db
        .select({
            id: user.id,
            name: user.name,
            image: user.image,
            bannerImage: user.bannerImage,
            bio: user.bio,
            createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
    return userData;
}
