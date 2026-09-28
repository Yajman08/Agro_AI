/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F3F0E7",
        surface: "#FBFAF5",
        ink: "#1E2B20",
        "ink-soft": "#586653",
        line: "#D9D8C8",
        command: "#203629",
        moss: "#7F9B6A",
        forest: {
          50: "#E8EFE5",
          100: "#D3E0CD",
          300: "#9AAF8D",
          500: "#63865C",
          600: "#456E4B",
          700: "#315D3D",
          900: "#203629",
        },
        clay: "#B76F48",
        amber: {
          100: "#F2E3C4",
          500: "#D39A32",
          700: "#8C641D",
        },
        sienna: {
          100: "#F1D8D0",
          500: "#B44F3A",
          700: "#853729",
        },
        sky: {
          100: "#DCEAE8",
          500: "#7FAEB4",
          700: "#416D73",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(35, 41, 33, 0.04), 0 4px 16px rgba(35, 41, 33, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
