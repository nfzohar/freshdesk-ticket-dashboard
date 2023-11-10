function paletteColorMixer (envColor, intensity, mixWithColor) {
  let color = '';

  if(envColor == 'primary'){
    color = process.env.VITE_THEME_PRIMARY_COLOR || '#00bf63';
  }
  if(envColor == 'secondary'){
    color = process.env.VITE_THEME_SECONDARY_COLOR || '#ffffff'
  }

  if(!color){
    return 'gainsboro';
  }

  return `color-mix(in srgb, ${color}, ` + mixWithColor + ` ${intensity * 100}%)`;
};

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: paletteColorMixer('primary', 0.9, 'white'),
          200: paletteColorMixer('primary', 0.7, 'white'),
          300: paletteColorMixer('primary', 0.5, 'white'),
          400: paletteColorMixer('primary', 0.3, 'white'),
          500: process.env.VITE_THEME_PRIMARY_COLOR || '#00bf63',
          600: paletteColorMixer('primary', 0.3, 'black'),
          700: paletteColorMixer('primary', 0.5, 'black'),
          800: paletteColorMixer('primary', 0.7, 'black'),
          900: paletteColorMixer('primary', 0.9, 'black'),
        },
        secondary: {
          100: paletteColorMixer('secondary', 0.9, 'white'),
          200: paletteColorMixer('secondary', 0.7, 'white'),
          300: paletteColorMixer('secondary', 0.5, 'white'),
          400: paletteColorMixer('secondary', 0.3, 'white'),
          500: process.env.VITE_THEME_SECONDARY_COLOR || '#ffffff',
          600: paletteColorMixer('secondary', 0.3, 'black'),
          700: paletteColorMixer('secondary', 0.5, 'black'),
          800: paletteColorMixer('secondary', 0.7, 'black'),
          900: paletteColorMixer('secondary', 0.9, 'black'),
        },
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
