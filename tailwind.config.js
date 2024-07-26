require('dotenv').config()

const primaryColor = process.env.VITE_THEME_PRIMARY_COLOR || 'gray'
const secondaryColor = process.env.VITE_THEME_SECONDARY_COLOR || 'white'

function paletteColorMixer(color, intensity, mixWithColor) {
  return `color-mix(in srgb, ${color}, ` + mixWithColor + ` ${intensity * 100}%)`
}

function paletteGenerator(color) {
  return {
    50: paletteColorMixer(color, 1, 'white'),
    100: paletteColorMixer(color, 0.9, 'white'),
    200: paletteColorMixer(color, 0.7, 'white'),
    300: paletteColorMixer(color, 0.5, 'white'),
    400: paletteColorMixer(color, 0.3, 'white'),
    500: color,
    600: paletteColorMixer(color, 0.3, 'black'),
    700: paletteColorMixer(color, 0.5, 'black'),
    800: paletteColorMixer(color, 0.7, 'black'),
    900: paletteColorMixer(color, 0.9, 'black'),
    1000: paletteColorMixer(color, 1, 'black')
  }
}

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: paletteGenerator(primaryColor),
        secondary: paletteGenerator(secondaryColor)
      },
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
      width: {
        '10p': '10%',
        '15p': '15%',
        '20p': '20%',
        '25p': '25%',
        '30p': '30%',
        '35p': '35%',
        '40p': '40%',
        '45p': '45%',
        '50p': '50%',
        '55p': '55%',
        '60p': '60%',
        '65p': '65%',
        '70p': '70%',
        '75p': '75%',
        '80p': '80%',
        '85p': '85%',
        '90p': '90%',
        '95p': '95%',
        '100p': '100%'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
