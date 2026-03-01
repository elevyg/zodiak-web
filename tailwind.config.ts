import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        clay: "var(--clay)",
        sand: "var(--sand)",
        cream: "var(--cream)",
        moss: "var(--moss)"
      },
      boxShadow: {
        card: "0 20px 40px rgba(35, 24, 21, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
