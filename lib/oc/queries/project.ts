import { gql } from "@apollo/client";
import { cacheLife, cacheTag } from "next/cache";
import { apolloClient } from "@/lib/apollo";

type GetProjectBalanceByProjectIdResult = {
    project?: {
        stats?: {
            id?: string;
            balance?: {
                value?: number;
                currency?: string;
            } | null;
        } | null;
    } | null;
};

const GET_PROJECT_BALANCE_BY_PROJECT_ID = gql`
        query(
            $slug: String
            ){
            project(
                slug: $slug
            ){
                stats{
                id
                balance{
                    value
                    currency
                }
                }
            }
        }
    `;

export async function getProjectBalanceByProjectId(projectId: string) {
    "use cache";
    cacheLife("days");
    cacheTag("projectBalance,project-listing");
    const result = await apolloClient.query<GetProjectBalanceByProjectIdResult>(
        {
            query: GET_PROJECT_BALANCE_BY_PROJECT_ID,
            variables: {
                slug: projectId,
            },
        },
    );

    return result;
}
