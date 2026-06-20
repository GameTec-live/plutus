import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    cacheComponents: true,
    // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"], // Uncomment when using standalone output
};

export default nextConfig;
