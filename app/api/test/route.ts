import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";

// https://www.apollographql.com/docs/react/data/typescript

// biome-ignore lint/correctness/noUnusedFunctionParameters: This is to be removed, example code for experimentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const result = await apolloClient.query({
        query: gql`
      query GetLocations {
        locations {
          id
          name
          description
          photo
        }
      }
    `,
    });

    return new Response(JSON.stringify(result.data));
}
