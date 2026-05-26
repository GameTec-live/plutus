import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    cacheComponents: true,
    transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default nextConfig;
