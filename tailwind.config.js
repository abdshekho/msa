/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [ "var(--font-sans)", ...fontFamily.sans ],
      },
      colors: {
        primary: "#b2791a",
        secondary: "#023f6f",
        tertiary: "#195568",
        "black-100": "#303e49",
        "black-200": "#091f26",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/herobg2.webp')",
      },
    },
  },
  plugins: [
    require( 'flowbite/plugin' )
  ],
  darkMode: 'class',
};