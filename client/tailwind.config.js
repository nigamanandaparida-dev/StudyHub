/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#E0F2FE', // Light Blue
        'brand-green': '#22C55E', // Green
        'brand-black': '#000000',
        'brand-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
