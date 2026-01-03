import { apolloClient } from "@/lib/apollo";
import { gql } from "@apollo/client";

// https://www.apollographql.com/docs/react/data/typescript

export async function GET(request: Request) {


    const result = await apolloClient
        .query({
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