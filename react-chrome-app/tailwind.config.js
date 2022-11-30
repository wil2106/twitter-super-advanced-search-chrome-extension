/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        'twitter-blue': {
          100: '#2F8BD8',
        },
        'twitter-grey': {
          100: '#71767B',
          200: '#202327',
          300: '#191A1A',
        }
      },
    },
  },
  plugins: [],
}