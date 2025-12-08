/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0e27',
        'cyber-gray': '#1a1f3a',
        'cyber-light': '#252a4a',
        'neon-green': '#00ff41',
        'neon-green-glow': '#00ff41',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.neon-green"), 0 0 20px theme("colors.neon-green")',
        'neon-sm': '0 0 2px theme("colors.neon-green"), 0 0 10px theme("colors.neon-green")',
      },
    },
  },
  plugins: [],
}

