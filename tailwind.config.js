/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#08080d',
          900: '#0b0b12',
          850: '#10101a',
          800: '#14141f',
          750: '#1a1a28',
          700: '#20202f',
          600: '#2a2a3c',
          500: '#3a3a52',
          400: '#52526e',
          300: '#7a7a99',
          200: '#a8a8c0',
          100: '#d6d6e6',
        },
        rose: {
          50: '#fff1f4',
          100: '#ffe0e7',
          200: '#ffc7d4',
          300: '#ff9fb5',
          400: '#ff6889',
          500: '#ff2d55',
          600: '#f51241',
          700: '#cf0a37',
          800: '#a90e35',
          900: '#8d1233',
        },
        cyan: {
          400: '#22e0c4',
          500: '#00e5c7',
          600: '#00c4ad',
        },
        gold: {
          400: '#ffd56b',
          500: '#ffc54d',
          600: '#f5b13d',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255,45,85,0.55)',
        'glow-cyan': '0 0 40px -8px rgba(0,229,199,0.45)',
        card: '0 20px 50px -20px rgba(0,0,0,0.85)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(255,45,85,0.18), transparent 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slide-down 0.3s ease both',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.16,1,0.3,1) infinite',
      },
    },
  },
  plugins: [],
};
