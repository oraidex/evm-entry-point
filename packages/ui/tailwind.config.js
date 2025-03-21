/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.stories.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutralContent: "var(--neutralContent)",
        baseContent: "var(--baseContent)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        boxSelect: "var(--boxSelect)",
        borderBox: "var(--borderBox)",
        borderContainer: "var(--borderContainer)",
        highlight: "var(--highlight)",
        highlightBackground: "var(--highlightBackground)",
        backgroundWarning: "var(--backgroundWarning)",
        warningText: "var(--warningText)",

        swapBtn: "var(--swapBtn)",
        primaryBtnBg: "var(--primaryBtnBg)",
        primaryBtnText: "var(--primaryBtnText)",
        thirdBtnBg: "var(--thirdBtnBg)",
        secondaryNeutralText: "var(--secondaryNeutralText)",
      },
      borderRadius: {
        borderWrapperRadius: "var(--borderWrapperRadius)",
        boxRadius: "var(--boxRadius)",
        boxSelectRadius: "var(--boxSelectRadius)",
        buttonRadius: "var(--buttonRadius)",
      },
      animation: {
        spin: "spin 1s linear",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
