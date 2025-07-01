/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode support
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        navyblue: {
          DEFAULT: "#162144",
          light: "#2a3b5c", // Lighter navy blue for hover states
        },
      },
    },
  },
  plugins: [],
};
