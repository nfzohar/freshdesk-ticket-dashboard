import { sortBy, get } from 'lodash'
import { auth } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { configuration } from '@/stores/configuration'

const toast = useToast()

export function checkAuthCredentials(username: String, password: String) {
  let authenticationSuccess = false

  if (auth().authenticated) {
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

  auth().setAuthState(authenticationSuccess)

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

export async function updatePanelInState(
  rows: Array,
  newValue: String,
  panelId: String,
  property: String
) {
  let tempRows = rows

  tempRows.forEach((row) => {
    row.forEach((panel) => {
      if (panel.id == panelId) {
        panel[property] = newValue
      }
    })
  })

  await configuration().updateLayoutGroups(rows)
  return rows
}

// Generate a name, ticket_count dataset for graph display
export function generateGraphDataset(
  valueList: Object,
  sortProp = 'name-asc',
  labelField = 'name',
  valueField = 'ticket_count'
) {
  let sortByField = 'name'

  if (sortProp?.includes('ticket_count')) {
    sortByField = 'ticket_count'
  }

  let values = sortBy(Object.values(valueList), sortByField)

  if (sortProp.includes('desc')) {
    values = values.reverse()
  }

  return {
    labels: values?.map((field) => get(field, labelField)),
    values: values?.map((field) => get(field, valueField))
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
