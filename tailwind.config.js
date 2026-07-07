/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#061B2D',
          yellow: '#F9B233',
          green: '#4CAF50',
          bgLight: '#F8FAFC',
          textDark: '#14213D',
          glass: 'rgba(6, 27, 45, 0.65)',
          glassLight: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 25s linear infinite',
        'energy-flow': 'energy-flow 8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(15px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.3, filter: 'drop-shadow(0 0 10px rgba(76, 175, 80, 0.2))' },
          '50%': { opacity: 0.8, filter: 'drop-shadow(0 0 25px rgba(249, 178, 51, 0.6))' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'energy-flow': {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      },
      boxShadow: {
        'glow-yellow': '0 0 30px rgba(249, 178, 51, 0.25)',
        'glow-green': '0 0 30px rgba(76, 175, 80, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
