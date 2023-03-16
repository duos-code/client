/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      white: {
        10: '#FEFFFE',
        20: '#F4F4F4',
        30: '#D7D6D7',
        40: '#A8A8A9',
        50: '#010001',
      },
      black: '#000000',
      blue: {
        10: '#0199F1',
        20: '#006ABC',
        30: '#013183',
        40: '#002473',
        50: '#011C64',
      },
      gray: {
        10: '#C1C4CE',
        20: '#A7ACBB',
        30: '#65737E',
        40: '#4F5A67',
        50: '#353D47',
      },
    },
    extend: {},
  },

  plugins: []
}
