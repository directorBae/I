import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".transform-style-preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateX(180deg)",
        },
        ".flip-x": {
          transform: "scaleX(-1)",
        },
        ".flip-y": {
          transform: "scaleY(-1)",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
