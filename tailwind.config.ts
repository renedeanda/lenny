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
        void: '#000000',
        'void-light': '#0a0a0a',
        amber: '#ffb347',
        'amber-dark': '#cc7a00',
        'amber-dim': '#4d3319',
        crimson: '#dc143c',
        'crimson-dark': '#8b0000',
        ash: '#e0e0e0',           // Improved from #cccccc for better contrast
        'ash-dark': '#999999',    // Improved from #666666 for better readability
        'ash-darker': '#444444',  // Improved from #333333
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 3s infinite',
        'glitch-2': 'glitch-2 3s infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'distort': 'distort 4s ease-in-out infinite',
      },
      keyframes: {
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'glitch-2': {
          '0%, 100%': { transform: 'translate(0)', opacity: '1' },
          '25%': { transform: 'translate(2px, -2px)', opacity: '0.8' },
          '50%': { transform: 'translate(-2px, 2px)', opacity: '1' },
          '75%': { transform: 'translate(1px, 1px)', opacity: '0.9' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(5px) translateX(-5px)' },
        },
        'distort': {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(10deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
