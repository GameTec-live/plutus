import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { env } from "@/env";

export const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: env.OPEN_COLLECTIVE_ENDPOINT }),
    cache: new InMemoryCache(),
});
