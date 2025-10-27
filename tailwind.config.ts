import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem"
      },
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      colors: {
        brand: {
          teal: "#2C4F52",
          orange: "#D17A5F",
          tan: "#DBBF96",
          cream: "#F2E3D5",
          slate: "#3A3D40"
        }
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "Arial",
          "sans-serif"
        ],
        serif: [
          "ui-serif",
          "Georgia",
          "\"Times New Roman\"",
          "serif"
        ]
      },
      boxShadow: {
        soft: "0 20px 45px rgba(44, 79, 82, 0.15)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(160deg, #F2E3D5 0%, #DBBF96 100%)"
      }
    }
  },
  plugins: [typography]
};

export default config;
