/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    colors: {
      blue: '#0457F3',
      gray: { 10: '#FBFBFB', 20: '#F5F5F5' },
      border: '#D3DCE6'

    },
    extend: {},
  },

  plugins: [require("tw-elements/dist/plugin")]
}
