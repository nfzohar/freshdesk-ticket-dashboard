require('dotenv').config()

const primaryColor = process.env.VITE_THEME_PRIMARY_COLOR || '#00bf63'
const secondaryColor = process.env.VITE_THEME_SECONDARY_COLOR || '#ffffff'

function paletteColorMixer(color, intensity, mixWithColor) {
  return `color-mix(in srgb, ${color}, ` + mixWithColor + ` ${intensity * 100}%)`
}

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      height: {
        '10vh': '10vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh',
        '100vh': '100vh'
      },
      colors: {
        primary: {
          100: paletteColorMixer(primaryColor, 0.9, 'white'),
          200: paletteColorMixer(primaryColor, 0.7, 'white'),
          300: paletteColorMixer(primaryColor, 0.5, 'white'),
          400: paletteColorMixer(primaryColor, 0.3, 'white'),
          500: primaryColor,
          600: paletteColorMixer(primaryColor, 0.3, 'black'),
          700: paletteColorMixer(primaryColor, 0.5, 'black'),
          800: paletteColorMixer(primaryColor, 0.7, 'black'),
          900: paletteColorMixer(primaryColor, 0.9, 'black')
        },
        secondary: {
          100: paletteColorMixer(secondaryColor, 0.9, 'white'),
          200: paletteColorMixer(secondaryColor, 0.7, 'white'),
          300: paletteColorMixer(secondaryColor, 0.5, 'white'),
          400: paletteColorMixer(secondaryColor, 0.3, 'white'),
          500: secondaryColor,
          600: paletteColorMixer(secondaryColor, 0.3, 'black'),
          700: paletteColorMixer(secondaryColor, 0.5, 'black'),
          800: paletteColorMixer(secondaryColor, 0.7, 'black'),
          900: paletteColorMixer(secondaryColor, 0.9, 'black')
        }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
