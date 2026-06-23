import { env } from "@/env";
import { db } from "@/lib";
import { project, projectGoal, projectImage } from "@/lib/db/schema";
import { getPublicProjectImageUrl } from "@/lib/project-creation";

type PersistProjectInput = {
    project: {
        id: string;
        title: string;
        shortDescription: string;
        longDescription: string | null;
        images: { key: string; isPrimary: boolean }[];
        goals: {
            title: string;
            description: string;
            amount: number;
            isStretch: boolean;
            isPrimary: boolean;
        }[];
    };
    creatorId: string;
    openCollectiveSlug: string;
};

export async function persistCreatedProject(input: PersistProjectInput) {
    const { project: data } = input;
    const projectInsert = db.insert(project).values({
        id: data.id,
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        openCollectiveID: input.openCollectiveSlug,
        creator: input.creatorId,
    });
    const imageValues = data.images.map((image) => ({
        projectId: data.id,
        url: getPublicProjectImageUrl(env.S3_PUBLIC_URL, image.key),
        isPrimary: image.isPrimary,
    }));
    const goalValues = data.goals.map((goal) => ({
        ...goal,
        projectId: data.id,
    }));

    if (imageValues.length > 0 && goalValues.length > 0) {
        await db.batch([
            projectInsert,
            db.insert(projectImage).values(imageValues),
            db.insert(projectGoal).values(goalValues),
        ]);
    } else if (imageValues.length > 0) {
        await db.batch([
            projectInsert,
            db.insert(projectImage).values(imageValues),
        ]);
    } else if (goalValues.length > 0) {
        await db.batch([
            projectInsert,
            db.insert(projectGoal).values(goalValues),
        ]);
    } else {
        await db.batch([projectInsert]);
    }
}
