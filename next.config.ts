import type { NextConfig } from "next";
import "./env";
import { env } from "./env";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL(`${env.S3_PUBLIC_URL}/**`),
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
