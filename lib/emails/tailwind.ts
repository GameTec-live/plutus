import { pixelBasedPreset, type TailwindConfig } from "@react-email/components";

export const emailTailwindConfig = {
    presets: [pixelBasedPreset],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "#ffffff",
                foreground: "#0a0a0a",
                card: {
                    DEFAULT: "#ffffff",
                    foreground: "#0a0a0a",
                },
                popover: {
                    DEFAULT: "#ffffff",
                    foreground: "#0a0a0a",
                },
                primary: {
                    DEFAULT: "#63a402",
                    foreground: "#f8ffe9",
                },
                secondary: {
                    DEFAULT: "#f4f4f5",
                    foreground: "#18181b",
                },
                muted: {
                    DEFAULT: "#f5f5f5",
                    foreground: "#737373",
                },
                accent: {
                    DEFAULT: "#f5f5f5",
                    foreground: "#171717",
                },
                destructive: {
                    DEFAULT: "#df2225",
                    foreground: "#ffffff",
                },
                border: "#e5e5e5",
                input: "#e5e5e5",
                ring: "#a1a1a1",
                sidebar: {
                    DEFAULT: "#fafafa",
                    foreground: "#0a0a0a",
                    primary: "#63a402",
                    "primary-foreground": "#f8ffe9",
                    accent: "#f5f5f5",
                    "accent-foreground": "#171717",
                    border: "#e5e5e5",
                    ring: "#a1a1a1",
                },
                chart: {
                    "1": "#d2f33c",
                    "2": "#aae700",
                    "3": "#80c800",
                    "4": "#63a402",
                    "5": "#4a7d06",
                },
            },
            borderRadius: {
                sm: "10px",
                md: "12px",
                lg: "14px",
                xl: "18px",
                "2xl": "22px",
                "3xl": "26px",
                "4xl": "30px",
            },
            fontFamily: {
                sans: [
                    "Arial",
                    "Helvetica Neue",
                    "Helvetica",
                    "sans-serif",
                ],
            },
        },
    },
} satisfies TailwindConfig;
