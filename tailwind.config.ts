import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0c12",
        surface: "#15171f",
        accent: "#8b7cff",
      },
    },
  },
  plugins: [],
};
export default config;
