import { cacheLife, cacheTag } from "next/cache";
import { apolloClient } from "@/lib/apollo";
import { cacheTags } from "@/lib/cache-tags";
import { GetProjectBalanceByProjectIdDocument } from "@/lib/oc/generated/operations";

export async function getProjectBalanceByProjectId(
    slug: string,
    projectId: string,
) {
    "use cache";
    cacheLife("hours");
    cacheTag(
        cacheTags.projects.all,
        cacheTags.openCollective.projectBalance(projectId),
    );
    const result = await apolloClient.query({
        query: GetProjectBalanceByProjectIdDocument,
        variables: {
            slug: slug,
        },
    });

    return result;
}
