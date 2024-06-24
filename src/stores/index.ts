import { auth } from './auth'
import { information } from './information'
import { configuration } from './configuration'

export default {
  install: (app: any) => {
    const authStore = auth()
    const informationStore = information()
    const configurationStore = configuration()

    app.config.globalProperties.$auth = authStore
    app.config.globalProperties.$information = informationStore
    app.config.globalProperties.$configuration = configurationStore

    authStore.initializeStateFromStorage()
    informationStore.initializeStateFromStorage()
    configurationStore.initializeConfigurationFromStorage()
  }
}
