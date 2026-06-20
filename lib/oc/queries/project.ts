import { cacheLife, cacheTag } from "next/cache";
import { apolloClient } from "@/lib/apollo";
import { GetProjectBalanceByProjectIdDocument } from "@/lib/oc/generated/operations";

export async function getProjectBalanceByProjectId(projectId: string) {
    "use cache";
    cacheLife("days");
    cacheTag("projectBalance", "project-listing");
    const result = await apolloClient.query({
        query: GetProjectBalanceByProjectIdDocument,
        variables: {
            slug: projectId,
        },
    });

    return result;
}
