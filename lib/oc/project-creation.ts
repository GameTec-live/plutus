import { env } from "@/env";

export {
    getOpenCollectiveProjectIdentity,
    slugifyProjectTitle,
} from "@/lib/oc/project-identity";

export function getOpenCollectiveParentSlug() {
    const url = new URL(env.OPEN_COLLECTIVE_COLLECTIVE_URL);
    const parts = url.pathname.split("/").filter(Boolean);
    const slug = parts.at(-1);
    if (!slug || !/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
        throw new Error(
            "OPEN_COLLECTIVE_COLLECTIVE_URL must point to a collective.",
        );
    }
    return slug.toLowerCase();
}
