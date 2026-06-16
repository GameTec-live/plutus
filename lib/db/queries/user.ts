import { eq } from "drizzle-orm";
import { db } from "@/lib";
import { user } from "../schema";

export async function getPublicUserById(id: string) {
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
