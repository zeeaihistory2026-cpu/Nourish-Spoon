/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0D5428',
          'primary-dark': '#073B21',
          'primary-light': '#1b743c',
          gold: '#C99B36',
          'gold-light': '#E2BB62',
          cream: '#FFF9EC',
          parchment: '#FBF4E4',
          surface: '#FFFFFF',
          text: '#10271A',
          muted: '#5A6D60',
          border: '#E8DFC8',
          // Dark mode
          'dark-bg': '#0C1B12',
          'dark-surface': '#14291C',
          'dark-card': '#183223',
          'dark-border': '#24422F',
          'dark-text': '#F7F1E5',
          'dark-muted': '#9BB2A4',
          'dark-primary': '#77A76A'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(13, 84, 40, 0.06)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'modal': '0 20px 40px -8px rgba(13, 84, 40, 0.25)',
      }
    },
  },
  plugins: [],
}
