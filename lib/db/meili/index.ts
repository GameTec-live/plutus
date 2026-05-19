import { Meilisearch } from "meilisearch";
import { env } from "@/env";

export const meili = new Meilisearch({
    host: env.MEILI_URL,
    apiKey: env.MEILI_MASTER_KEY,
});

meili.index(env.MEILI_INDEX).updateSettings({
    searchableAttributes: [
        "id",
        "title",
        "shortDescription",
        "longDescription",
        "creator",
    ],
});
