import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15211f",
        leaf: "#1f7a5f",
        mint: "#e9f7f1",
        sun: "#f5b340",
        porcelain: "#f7faf8",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(21, 33, 31, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
