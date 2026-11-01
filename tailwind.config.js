require('dotenv').config()

const plugin = require('tailwindcss/plugin')

const primaryColor = process.env.VITE_THEME_PRIMARY_COLOR || 'gray'
const secondaryColor = process.env.VITE_THEME_SECONDARY_COLOR || ''

function paletteColorMixer(color, intensity, mixWithColor) {
  return `color-mix(in srgb, ${color}, ` + mixWithColor + ` ${intensity * 100}%)`
}

function paletteGenerator(color) {
  return {
    // Channel-based, so opacity modifiers work: bg-primary/10, ring-primary/40.
    DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
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

// --- Theme tokens -----------------------------------------------------------
// Surfaces and text are CSS variables (RGB channels) that switch between light
// and dark mode. VITE_THEME_SECONDARY_COLOR tints whichever theme it suits.

function parseColor(color) {
  const value = String(color ?? '').trim()
  let hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1]

  if (hex) {
    if (hex.length == 3) hex = [...hex].map((c) => c + c).join('')
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  }

  const rgb = value.match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
  return rgb ? rgb.slice(1, 4).map(Number) : null
}

const mix = (a, b, amount) => a.map((c, i) => Math.round(c + (b[i] - c) * amount))
const channels = (rgb) => rgb.join(' ')
// Same brightness formula and threshold as colorIsDark() in CommonMethods.ts.
const isDark = ([r, g, b]) => Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b) <= 155

const white = [255, 255, 255]
const black = [0, 0, 0]

function lightTokens(base = [255, 255, 255]) {
  return {
    '--canvas': channels(mix(base, [236, 238, 243], 0.55)),
    '--surface': channels(base),
    '--surface-2': channels(mix(base, [226, 229, 236], 0.6)),
    '--line': channels(mix(base, [208, 213, 222], 0.85)),
    '--ink': '17 20 27',
    '--ink-muted': '91 99 115'
  }
}

function darkTokens(base = [22, 25, 31]) {
  return {
    '--canvas': channels(mix(base, black, 0.35)),
    '--surface': channels(base),
    '--surface-2': channels(mix(base, white, 0.06)),
    '--line': channels(mix(base, white, 0.12)),
    '--ink': '232 234 239',
    '--ink-muted': '154 161 174'
  }
}

const primaryRgb = parseColor(primaryColor) ?? [107, 114, 128]
const secondaryRgb = parseColor(secondaryColor)

const primaryTokens = {
  '--primary': channels(primaryRgb),
  '--on-primary': isDark(primaryRgb) ? '255 255 255' : '17 20 27'
}

const themeTokens = plugin(({ addBase }) => {
  addBase({
    ':root': {
      ...primaryTokens,
      ...lightTokens(secondaryRgb && !isDark(secondaryRgb) ? secondaryRgb : undefined)
    },
    ':root.dark': darkTokens(secondaryRgb && isDark(secondaryRgb) ? secondaryRgb : undefined)
  })
})

const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // Rows and columns layouts build grid-cols-N from the panel count at runtime.
  safelist: [{ pattern: /^grid-cols-([1-9]|1[0-2])$/ }],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: paletteGenerator(primaryColor),
        'on-primary': token('on-primary'),
        canvas: token('canvas'),
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        line: token('line'),
        ink: { DEFAULT: token('ink'), muted: token('ink-muted') },
        // Legacy name, now mapped onto the theme surfaces.
        secondary: {
          50: token('canvas'),
          100: token('canvas'),
          200: token('surface-2'),
          300: token('line'),
          400: token('surface-2'),
          500: token('surface'),
          600: token('surface-2'),
          700: token('surface-2'),
          800: token('line'),
          900: token('line'),
          1000: token('ink')
        }
      },
      keyframes: {
        'dialog-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        }
      },
      animation: {
        'dialog-in': 'dialog-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 150ms ease-out'
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
  plugins: [themeTokens]
}
