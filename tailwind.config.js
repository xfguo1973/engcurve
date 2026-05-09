/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90D9',
        secondary: '#F5F5DC',
        success: '#52C41A',
        warning: '#FAAD14',
        danger: '#FF4D4F',
        info: '#1890FF',
      }
    },
  },
  plugins: [],
}
