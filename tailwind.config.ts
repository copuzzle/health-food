import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        oat: "#f5efe3",
        kelp: "#163b32",
        sage: "#8aa378",
        citrus: "#e8b44f",
        clay: "#c97955"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(22, 59, 50, 0.14)"
      }
    },
  },
  plugins: [forms],
};

export default config;
