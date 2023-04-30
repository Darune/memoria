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
    extend: {}
  },
  plugins: []
};