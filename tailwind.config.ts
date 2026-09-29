import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        card: "#111113",
        border: "#27272A",
        primary: { DEFAULT: "#7C3AED", foreground: "#FAFAFA" },
        foreground: "#FAFAFA",
        muted: "#A1A1AA",
      },
      borderRadius: { xl: "16px", "2xl": "16px" },
      fontFamily: { sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"], mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"] },
    },
  },
  plugins: [],
};
export default config;
