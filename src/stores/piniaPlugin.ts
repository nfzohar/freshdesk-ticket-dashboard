import { auth } from './auth'
import { Store } from './index'
import { configuration } from './configurationStore'

export default {
  install: (app: any) => {
    const authStore = auth()
    const mainStore = Store()
    const configurationStore = configuration()

    app.config.globalProperties.$auth = authStore
    app.config.globalProperties.$store = mainStore
    app.config.globalProperties.$configuration = configurationStore

    mainStore.initializeStateFromStorage()
  }
}
