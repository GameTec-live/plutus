import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { env } from "@/env";

export const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: env.OPEN_COLLECTIVE_ENDPOINT,
        headers: {
            "Personal-Token": env.OPEN_COLLECTIVE_TOKEN,
        },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: "no-cache",
        },
        watchQuery: {
            nextFetchPolicy: "no-cache",
        },
    },
});
