/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
      },
      screens: {
        'xl': '1280px',
      },
    },
  },
  plugins: [],
};
