import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surfaceStrong: "var(--surface-strong)",
        accent: "var(--accent)",
        accentStrong: "var(--accent-strong)",
        ink: "var(--ink)",
        inkMuted: "var(--ink-muted)",
        border: "var(--border)",
        inverse: "var(--inverse)"
      },
      boxShadow: {
        card: "0 20px 40px rgba(28, 28, 28, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
