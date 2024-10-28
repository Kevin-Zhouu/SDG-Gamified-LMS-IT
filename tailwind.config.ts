/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        btn: {
          background: 'hsl(var(--btn-background))',
          'background-hover': 'hsl(var(--btn-background-hover))',
        },
        /**SDG Colours */ 
        "sdg": {
          "1": "#E5243B",
          "2": "#DDA63A",
          "3": "#4C9F38",
          "4": "#C5192D",
          "5": "#FF3A21",
          "6": "#26BDE2",
          "7": "#FCC30B",
          "8": "#A21942",
          "9": "#FD6925",
          "10": "#DD1367",
          "11": "#FD9D24",
          "12": "#BF8B2E",
          "13": "#3F7E44",
          "14": "#0A97D9",
          "15": "#56C02B",
          "16": "#00689D",
          "17": "#19486A",
        },
      },
    },
  },
  plugins: [],
};