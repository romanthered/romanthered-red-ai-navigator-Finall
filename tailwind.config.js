/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'red-primary': '#FF0033',
        'electric-blue': '#00D9FF',
        'hot-pink': '#FF006E',
        'purple': '#8B00FF',
        'gold': '#FFD700',
      },
    },
  },
  plugins: [],
}
