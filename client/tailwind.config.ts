/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#C0672E',
        amber: '#F5A623',
        indigo: '#1A2A3A',
        cream: '#FDF6F0',
      },
    },
  },
  plugins: [],
};
