import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        mint: {
          50: "var(--mint-50)",
          100: "var(--mint-100)",
          200: "var(--mint-200)",
          300: "var(--mint-300)",
          800: "var(--mint-800)",
          900: "var(--mint-900)",
        },
        gold: {
          100: "var(--gold-100)",
          400: "var(--gold-400)",
          600: "var(--gold-600)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
