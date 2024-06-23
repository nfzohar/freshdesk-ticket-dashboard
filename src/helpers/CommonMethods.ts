import { auth } from '../stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()

export function checkAuthCredentials(username: String, password: String) {
  let authenticationSuccess = false

  if (auth().$state.auth) {
    return
  }

  const envUsername = import.meta.env.VITE_ACCESS_CONTROL_USERNAME
  const envPassword = import.meta.env.VITE_ACCESS_CONTROL_PASSWORD

  if (!envUsername || !envPassword) {
    console.error('Credentials not set. Contact server owner.')
    return
  }

  if (!username || !password) {
    let theError = 'Incorrect credentials. Please, try again.'

    toast.error(theError)
    console.error(theError)
    return
  }

  authenticationSuccess = username == envUsername && password == envPassword

  auth().canAuthenticate(authenticationSuccess)

  if (!authenticationSuccess) {
    let theError = 'Incorrect credentials. Please, try again.'

    toast.error(theError)
    console.error(theError)
    return
  }
}

// src(modified): https://gist.github.com/krabs-github/ec56e4f1c12cddf86ae9c551aa9d9e04
export function colorIsDark(color: String) {
  if (!color) {
    return false
  }

  let r, g, b

  if (color.match(/^rgb/)) {
    // eslint-disable-next-line no-use-before-define
    const colorAsRGB = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    if (colorAsRGB) {
      r = colorAsRGB[1]
      g = colorAsRGB[2]
      b = colorAsRGB[3]
    }
  } else {
    const colorAsHex = +('0x' + color.slice(1).replace(String(color.length < 5 && /./g), '$&$&'))

    if (colorAsHex) {
      r = colorAsHex >> 16
      g = (colorAsHex >> 8) & 255
      b = colorAsHex & 255
    }
}

  if (typeof r && g && b) {
    r = Number(r)
    g = Number(g)
    b = Number(b)

    const hsp: any = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

    const darkColorThreshold = 155
    // return !(hsp > 127.5)

    return !(hsp > darkColorThreshold)
  }
}

// Check, if the number is even.
export function isEven(number: number) {
  return number % 2 === 0
}

// Check, if the number is odd.
export function isOdd(number: number) {
  return number % 2 !== 0
}

// Read @/components/panels folder and return a list of present components.
export function getAvailablePanelComponents() {
  const listOfPanelComponents = new Array()

  Object.entries(import.meta.glob('@/components/panels/*')).map(([path]) => {
    const parts = path.split('/')
    const filename = parts[parts.length - 1]
    const componentName = filename.slice(0, -4)

    listOfPanelComponents.push(componentName)
  })

  return listOfPanelComponents
}
