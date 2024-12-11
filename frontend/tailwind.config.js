/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
    fontFamily: {
      sans: ['"Inter"', 'sans-serif']
    },

    plugins: [
      require('flowbite/plugin'),
  ],

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



 