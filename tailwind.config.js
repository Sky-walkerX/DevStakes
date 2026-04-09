/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f8f7f4', 100: '#eeece4', 200: '#ddd9cc',
          300: '#c5bfaa', 400: '#a89d84', 500: '#948469',
          600: '#87745d', 700: '#70604e', 800: '#5c4f43',
          900: '#4c4139', 950: '#282118',
        },
        paper: { 50: '#fdfcf8', 100: '#f9f6ef', 200: '#f2ede0', 300: '#e8e0ca' },
        accent: { 400: '#6b8f71', 500: '#527a59', 600: '#3d6145' },
        dark: { bg: '#12100e', surface: '#1a1712', border: '#2a2520', text: '#c8c0aa' }
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
