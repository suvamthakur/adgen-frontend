/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkest: "#1B262C",
        darker: "#0F4C75",
        lighter: "#3282B8",
        lightest: "#ebf4fa",
      },
    },
  },
  plugins: [],
};
