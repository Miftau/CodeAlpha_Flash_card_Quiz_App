/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0984E3',
        secondary: '#00B894',
        danger: '#D63031',
        dark: '#2D3436',
        light: '#F5F7FA',
        gray: '#636E72',
      },
    },
  },
  plugins: [],
}