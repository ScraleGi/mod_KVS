/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Passe ggf. den Pfad an dein Projekt an
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['group-focus'],
    },
  },
  plugins: [],
}
