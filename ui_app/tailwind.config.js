/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5BB318",
        secondary: "#2192FF",
        accent: "#7DCE13",
      },
    },
  },
  plugins: [],
};
