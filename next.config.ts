import type { NextConfig } from "next";
import "@/env";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tailwindcss.com",
                port: "",
                pathname: "/plus-assets/img/logos/mark.svg",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"], // Uncomment when using standalone output
};

export default nextConfig;
