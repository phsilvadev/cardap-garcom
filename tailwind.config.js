/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F8F8F8',
        ink: '#0A0A0A',
        muted: '#666666',
        line: '#E4E4E4',
        success: '#287D58',
        danger: '#BA2525',
        brand: {
          DEFAULT: '#FFBF00',
          50: '#FFF6D8',
          100: '#FFEDAD',
          500: '#FFBF00',
          600: '#E5AB00',
          700: '#B58400',
        },
      },
      fontFamily: {
        sans: ['Outfit_400Regular'],
        medium: ['Outfit_500Medium'],
        semibold: ['Outfit_600SemiBold'],
        bold: ['Outfit_700Bold'],
        wordmark: ['LibreBaskerville_700Bold_Italic'],
      },
    },
  },
  plugins: [],
};
