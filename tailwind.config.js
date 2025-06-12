/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true, // <-- This makes ALL Tailwind utilities use !important
  theme: {
    extend: {},
  },
  plugins: [],
};