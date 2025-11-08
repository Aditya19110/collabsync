/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0079bf',
        secondary: '#5e6c84',
        success: '#61bd4f',
        warning: '#f2d600',
        danger: '#eb5a46',
        info: '#00c2e0',
      },
    },
  },
  plugins: [],
}
