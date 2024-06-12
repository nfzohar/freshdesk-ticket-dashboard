import { auth } from './auth'
import { configuration } from './configurationStore'

export default {
  install: (app: any) => {
    const authStore = auth()
    const configurationStore = configuration()

    app.config.globalProperties.$auth = authStore
    app.config.globalProperties.$configuration = configurationStore

    authStore.initializeStateFromStorage()
    configurationStore.initializeConfigurationFromStorage()
  }
}
