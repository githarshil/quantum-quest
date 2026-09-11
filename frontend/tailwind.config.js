/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chalkboard: '#0c1524',
        chalkboardDark: '#080d17',
        chalkboardCard: '#131e33',
        cream: '#faf7ed',
        creamCard: '#f4efe0',
        craftPaper: '#d8b98f',
        tapeBeige: '#ece4ce',
        tapeYellow: '#f3e69f',
        pinRed: '#ef4444',
        pinGold: '#f59e0b',
        pinBlue: '#3b82f6',
        pinGreen: '#10b981',
        stampGreen: '#15803d',
        crtGreen: '#22c55e',
        crtGlow: '#4ade80',
        crtBg: '#05180f',
        neonCyan: '#06b6d4',
        retroPurple: '#8b5cf6',
      },
      fontFamily: {
        handwriting: ['"Patrick Hand"', '"Kalam"', 'cursive', 'sans-serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'paper': '0 10px 25px -3px rgba(0,0,0,0.45), 0 4px 10px -2px rgba(0,0,0,0.3)',
        'paper-lift': '0 22px 40px -5px rgba(0,0,0,0.55), 0 10px 18px -4px rgba(0,0,0,0.4)',
        'crt': '0 0 25px rgba(34, 197, 94, 0.35), inset 0 0 20px rgba(34, 197, 94, 0.15)',
        'pin': '1px 3px 6px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
