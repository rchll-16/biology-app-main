// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in forwards',
        'fade-out': 'fade-out 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

