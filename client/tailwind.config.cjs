/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design system (client/DESIGN.md)
        canvas: '#ffffff',
        ink: '#222222',
        'body-text': '#3f3f3f',
        muted: '#6a6a6a',
        'muted-soft': '#929292',
        hairline: '#dddddd',
        'hairline-soft': '#ebebeb',
        'border-strong': '#c1c1c1',
        'surface-soft': '#f7f7f7',
        'surface-strong': '#f2f2f2',
        primary: '#ff385c',
        'primary-active': '#e00b41',
        'primary-disabled': '#ffd1da',
        'on-primary': '#ffffff',
        error: '#c13515',
      },
      fontFamily: {
        sans: [
          'Circular',
          '-apple-system',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      borderRadius: {
        md: '14px',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
