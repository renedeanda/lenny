import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#faf8f5',
        'cream-dark': '#f5f1e8',
        orange: '#ff6b35',
        'orange-light': '#ff8c42',
        'orange-dark': '#cc5429',
        ember: '#ffab73',
        charcoal: '#1a1a1a',
        'charcoal-light': '#4a4a4a',
        warm: '#fff5e6',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'ember-rise': 'ember-rise 8s ease-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'ember-rise': {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(20px) scale(0)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
