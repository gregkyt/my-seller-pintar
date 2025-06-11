import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          gray: {
            100: "#F3F4F6",
            900: "#111827",
          },
          blue: {
            200: "#BFDBFE",
            500: "#3B82F6",
            600: "#2563EB",
            900: "#1E3A8A",
          },
          slate: {
            200: "#E2E8F0",
            600: "#475569",
            900: "#0F172A",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
