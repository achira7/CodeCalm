/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
    fontFamily: {
      sans: ['"Inter"', 'sans-serif']
    },

    theme:{
      extend: {
        colors:{
          primary:'#74BCFF',
          ccred:'#F99BAB',
          ccgreen:'#9BDFC4',
        },
    },
  },
  darkMode: 'class',
  }

 