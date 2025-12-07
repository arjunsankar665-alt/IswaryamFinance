/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A2C2A',
          dark: '#2D1B1A',
          light: '#6B4545',
        },
        brand: {
          brown: '#4A2C2A',
          'brown-dark': '#2D1B1A',
          'brown-light': '#6B4545',
          gold: '#D4AF37',
          'gold-dark': '#B8960C',
          'gold-light': '#F4D03F',
        },
        accent: {
          gold: '#D4AF37',
        }
      },
    },
  },
  plugins: [],
}

