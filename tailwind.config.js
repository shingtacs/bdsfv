/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        lavender: {
          DEFAULT: "#C8B6E2",
          light: "#E4D8F3",
          dark: "#9B82C4",
        },
        peach: {
          DEFAULT: "#FFD8B8",
          light: "#FFEAD6",
          dark: "#FFB98A",
        },
        plum: {
          DEFAULT: "#4A3B5C",
          light: "#6E5A85",
        },
        rose: "#FF9EAA",
        gold: "#E8C468",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        flicker: {
          "0%, 100%": { opacity: 1, transform: "scaleY(1)" },
          "50%": { opacity: 0.75, transform: "scaleY(0.92)" },
        },
        "pop-in": {
          "0%": { opacity: 0, transform: "scale(0.9) translateY(10px)" },
          "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        flicker: "flicker 1.4s ease-in-out infinite",
        "pop-in": "pop-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
