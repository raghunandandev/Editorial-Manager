/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'brand-blue': {
          DEFAULT: '#003D63',
          dark: '#002B47',
        },
        'brand-orange': '#FF6C24',
        'brand-teal': '#00A79D',
        'light-gray': '#F8F8F8',
        'footer-bg': '#F7F7F7',
        'footer-text': '#555555',
      }
    },
  },
  plugins: [],
}
