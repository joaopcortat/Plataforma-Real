/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We will add custom colors here later based on user preference
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Defaulting to Inter as a safe premium choice
      }
    },
  },
  plugins: [],
}
