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
