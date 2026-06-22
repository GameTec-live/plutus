import { env } from "@/env";

export function getOpenCollectiveWebUrl() {
    return new URL(new URL(env.OPEN_COLLECTIVE_COLLECTIVE_URL).origin);
}
