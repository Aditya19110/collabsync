/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#475569',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        info: '#0ea5e9',
      },
    },
  },
  plugins: [],
}
