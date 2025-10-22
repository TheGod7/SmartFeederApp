/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        itim: ["Itim", "sans-serif"],
      },

      colors: {
        text: "#EAE9FC",
        background: "#070A13",
        primary: "#FABC66",
        secondary: "#4922B4",
        accent: "#FF9500",
        wrong: "#FF4848",
      },
    },
  },

  safelist: [
    {
      pattern:
        /text-(text|background|primary|secondary|accent|wrong|white|black)/,
      variants: ["hover", "focus", "active"],
    },
    {
      pattern:
        /bg-(text|background|primary|secondary|accent|wrong|white|black|transparent)/,
      variants: ["hover", "focus", "active"],
    },

    {
      pattern: /border(-b)?-(text|primary|accent|wrong)/,
    },
    {
      pattern: /border(-b)?-(1|2|4|8)/,
    },
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "text-4xl",
    "text-5xl",
  ],

  plugins: [],
};
