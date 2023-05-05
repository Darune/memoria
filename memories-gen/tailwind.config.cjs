/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: [
    'dark:fill-cyan-50',
    'dark:fill-slate-200',
    'dark:fill-gray-400',
    'dark:bg-cyan-50',
  ],
  theme: {
    extend: {
      height: {
        '4/3-canvas-edit': 'min(100%, calc((100vw * 3 / 4)));',
        thumbnail: '156px',
      },
      width: {
        '4/3-canvas-edit': 'min(100%, calc((100vh * 4 / 4)));',
        thumbnail: '208px',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      keyframes: {
        flash: {
          '0%, 100%': { fill: '#9ca3af' },
          '50%': { fill: '#ecfeff'}
        },
        'flash-2': {
          '0%, 100%': { fill: '#9ca3af' },
          '50%': { fill: '#ecfeff'}
        },
      },
      animation: {
        flash: 'flash 0.6s cubic-bezier(0.54, 0.79, 0, 1) 1',
        'flash-2': 'flash-2 0.6s cubic-bezier(0.54, 0.79, 0, 1) 1',
        'flash-slow': 'flash 3.0s linear infinite',
      }
    }
  },
  plugins: []
};