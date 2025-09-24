/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2EB086',
        secondary: '#f1f5f9',
      }
    },
  },
  plugins: [],
}
