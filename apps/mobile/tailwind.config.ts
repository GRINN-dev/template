import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";

import baseConfig from "@grinn/tailwind-config/native";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [baseConfig, nativewind],
  theme: {
    extend: {
      height: {
        10: "40px",
      },
      width: {
        10: "40px",
      },
      colors: {
        primary: {
          DEFAULT: "#545F66",
          100: "#E3E3E3",
          soft100: "#DDDFE0",
          light100: "#989FA3",
          300: "#858585",
        },
        secondary: {
          DEFAULT: "#1F94A3",
        },
        surface: {
          DEFAULT: "#F8FAFC",
        },
        brand: {
          secondary: "#F3A712",
        },
        danger: {
          DEFAULT: "#EA5A5A",
        },
        success: {
          DEFAULT: "#65BF77",
        },
        blue: {
          DEFAULT: "#1C84C7",
          link: "#0EA5E9",
        },
        black: {
          DEFAULT: "#000000",
          1: "#11827",
        },
      },
      fontFamily: {
        inter: ["Inter_400Regular", "sans-serif"],
      },
    },
  },
} satisfies Config;
