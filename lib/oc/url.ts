import { env } from "@/env";

export function getOpenCollectiveWebUrl() {
    return new URL(
        env.OPEN_COLLECTIVE_COLLECTIVE_URL.split("/").slice(0, -1).join("/"),
    );
}
