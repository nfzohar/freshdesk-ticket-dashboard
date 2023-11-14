import { Store } from '@/stores'

export function checkAuthCredentials(username: String, password: String) {
  let authenticationSuccess = false

  const envUsername = import.meta.env.VITE_ACCESS_CONTROL_USERNAME
  const envPassword = import.meta.env.VITE_ACCESS_CONTROL_PASSWORD

  if (!envUsername || !envPassword) {
    console.error('Credentials not set. Contact server owner.')
    return
  }

  if (!username || !password) {
    console.error('Incorrect credentials. Please, try again.')
    return
  }

  authenticationSuccess = username == envUsername && password == envPassword

  if (!authenticationSuccess) {
    console.error('Incorrect credentials. Please, try again.')
    return
  }

  Store().canAuthenticate(authenticationSuccess)
}

// src(modified): https://gist.github.com/krabs-github/ec56e4f1c12cddf86ae9c551aa9d9e04
export function colorIsDark(color: String) {
  if (!color) {
    return false
  }

  let r, g, b, hsp

  if (color.match(/^rgb/)) {
    let colorAsRGB = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    r = colorAsRGB[1]
    g = colorAsRGB[2]
    b = colorAsRGB[3]
  } else {
    let colorAsHex = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = colorAsHex >> 16
    g = (colorAsHex >> 8) & 255
    b = colorAsHex & 255
  }

  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  return !(hsp > 127.5)
}
