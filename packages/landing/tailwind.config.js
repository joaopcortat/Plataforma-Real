/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f',
                primary: {
                    DEFAULT: '#D4AF37', // Amarelo Real
                    dark: '#B5952F',
                },
                accent: {
                    DEFAULT: '#F97316', // Laranja detalhes
                    dark: '#EA580C',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
