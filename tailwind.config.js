/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode support
  content: ["./src/**/*.{js,ts,jsx,tsx,css}"],
  theme: {
    extend: {
      colors: {
        navyblue: {
          DEFAULT: '#162144',
        },
      },
    },
  },
  plugins: [],
};
