"use client";

import { Meilisearch } from "meilisearch";
import { env } from "@/env";

export const meili_client = new Meilisearch({
    host: env.NEXT_PUBLIC_MEILI_URL,
    apiKey: env.NEXT_PUBLIC_MEILI_SEARCH_KEY,
});
