import type { NextConfig } from "next";

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
                pathname: "/photo-1472099645785-5658abf4ff4e",
            },
        ],
    },
};

export default nextConfig;
