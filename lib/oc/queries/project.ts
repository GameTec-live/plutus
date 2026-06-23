import { cacheLife, cacheTag } from "next/cache";
import { apolloClient } from "@/lib/apollo";
import { cacheTags } from "@/lib/cache-tags";
import {
    CreateOpenCollectiveProjectDocument,
    DeleteOpenCollectiveProjectDocument,
    GetCollectiveCurrencyDocument,
    GetProjectBalanceByProjectIdDocument,
    GetProjectForCreationRecoveryDocument,
} from "@/lib/oc/generated/operations";
import { getOpenCollectiveParentSlug } from "@/lib/oc/project-creation";
import { getOpenCollectiveProjectIdentity } from "@/lib/oc/project-identity";

export async function getProjectBalanceByProjectId(
    slug: string,
    projectId: string,
) {
    "use cache";
    cacheLife("hours");
    cacheTag(cacheTags.openCollective.projectBalance(projectId));
    const result = await apolloClient.query({
        query: GetProjectBalanceByProjectIdDocument,
        variables: {
            slug: slug,
        },
    });

    return result;
}

export async function getConfiguredCollectiveCurrency() {
    "use cache";
    cacheLife("days");
    const result = await apolloClient.query({
        query: GetCollectiveCurrencyDocument,
        variables: { slug: getOpenCollectiveParentSlug() },
    });
    return result.data?.account?.currency ?? "EUR";
}

export async function createOpenCollectiveProject(input: {
    projectId: string;
    title: string;
    description: string;
}) {
    const parentSlug = getOpenCollectiveParentSlug();
    const identity = getOpenCollectiveProjectIdentity(
        input.title,
        input.projectId,
    );

    try {
        const result = await apolloClient.mutate({
            mutation: CreateOpenCollectiveProjectDocument,
            variables: {
                project: {
                    name: identity.name,
                    slug: identity.slug,
                    description: input.description,
                },
                parent: { slug: parentSlug },
                disableContributions: false,
                disableExpenses: false,
            },
        });
        const created = result.data?.createProject;
        if (!created?.slug) {
            throw new Error("Open Collective did not return a project slug.");
        }
        return { slug: created.slug, created: true };
    } catch (createError) {
        const recovery = await apolloClient.query({
            query: GetProjectForCreationRecoveryDocument,
            variables: { slug: identity.slug },
        });
        const existing = recovery.data?.project;
        if (
            existing?.slug === identity.slug &&
            existing.name === identity.name &&
            existing.parent?.slug === parentSlug
        ) {
            return { slug: existing.slug, created: false };
        }
        throw createError;
    }
}

export async function deleteOpenCollectiveProject(slug: string) {
    await apolloClient.mutate({
        mutation: DeleteOpenCollectiveProjectDocument,
        variables: { account: { slug } },
    });
}
