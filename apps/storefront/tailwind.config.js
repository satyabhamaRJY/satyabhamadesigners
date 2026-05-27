/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#090807',
        surface: '#141210',
        'surface-hover': '#1e1b18',
        border: '#2c251e',
        gold: {
          DEFAULT: '#d4af37',
          muted: '#af923d',
          light: '#f3e5ab',
        },
        maroon: '#4a0e17',
        emerald: '#0f382a',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 4px 20px rgba(212, 175, 55, 0.15)',
        heavy: '0 10px 35px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};
