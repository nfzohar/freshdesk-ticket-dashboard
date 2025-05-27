import { sortBy, get } from 'lodash'
import { auth } from '@/stores/auth'
import format from 'date-fns/format'
import { useToast } from 'vue-toastification'
import { configuration } from '@/stores/configuration'

const toast = useToast()

// Main authentication check method.
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

// Update a panel's instance in store state.
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

// Generate a name, ticket_count dataset for graph display.
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

// Use date-fns's format function on a date string and provide custom format.
export function fdate(date: string, dateFormat: string = 'yyyy. M. D') {
  return date ? format(new Date(date), dateFormat) : '-'
}

// Add an event listener for keystroke.
export function listenForKey(eventKey = '', performFunction: Function) {
  document.addEventListener('keydown', (event) => {
    if (event?.key == eventKey) {
      event.preventDefault()
      performFunction()
    }
  })
}

// Fetch choices of a ticekt field with given label.
export function ticketFieldOptions(ticketFieldArray: Array, label: String) {
  const index = ticketFieldArray.findIndex((field) => field?.label?.toLocaleLowerCase() == label)
  return get(ticketFieldArray, `[${index}].choices`) ?? []
}

// Take filters from information store and parse them into the api call url.
export function filterParser(apiCallUrl: String, filtersList: Object) {
  let urlWithParameters = new Array()

  const dateFilters = Object.values(filtersList?.date_filters ?? [])

  dateFilters.forEach((dateObject) => {
    const dateParams = setDateFilter(dateObject)
    urlWithParameters = urlWithParameters.concat(dateParams)
  })

  const fieldFilters = filtersList?.field_filters

  fieldFilters?.forEach((fieldFilter) => {
    if (fieldFilter['value'] != '') {
      let fieldParams = setFieldFilter(fieldFilter)
      urlWithParameters.push(fieldParams)
    }
  })

  urlWithParameters = urlWithParameters.filter((param) => param)

  if (urlWithParameters?.length) {
    const query = urlWithParameters.join(' AND ').trim()
    return `/api/v2/search/tickets?query="${encodeURI(query)}"`
  }

  return apiCallUrl
}

// Ticket field filters parser.
export function setFieldFilter(ticketFieldFilter: Object) {
  let ticketField = ticketFieldFilter?.name
  let filterValue = ticketFieldFilter?.value ?? ''

  switch (typeof filterValue) {
    case 'string':
      return `${ticketField}:'${filterValue}'`
    default:
      return `${ticketField}:${filterValue}`
  }
}

// Date filters parser.
export function setDateFilter(dateObject: { to: String; from: String; field: string }) {
  let dateParams = []

  if (dateObject?.from) {
    dateParams.push(`${dateObject?.field}:>'${fdate(dateObject?.from, 'yyyy-MM-dd')}'`)
  }
  if (dateObject?.to) {
    dateParams.push(`${dateObject?.field}:<'${fdate(dateObject?.to, 'yyyy-MM-dd')}'`)
  }

  return dateParams
}
