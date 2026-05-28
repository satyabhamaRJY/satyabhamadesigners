/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        stone: {
          950: '#0c0a09',
          900: '#1c1917',
          800: '#292524',
        }
      },
    },
  },
  plugins: [],
}
