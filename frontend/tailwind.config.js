
import animate from 'tw-animate-css'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales UAH
        primary: {
          DEFAULT: '#C8102E',
          50:  '#FFF0F2',
          100: '#FFD6DC',
          200: '#FFADB9',
          500: '#C8102E',
          600: '#A60D25',
          700: '#820A1D',
          900: '#3A040D',
        },
        secondary: {
          DEFAULT: '#003DA5',
          50:  '#E6EEFF',
          100: '#C4D4FF',
          200: '#92ABFF',
          500: '#003DA5',
          600: '#003190',
          700: '#00257A',
          900: '#000E3D',
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}