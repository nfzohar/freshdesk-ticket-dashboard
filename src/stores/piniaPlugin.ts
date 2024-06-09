import { auth } from './auth'
import { Store } from './index'
import { configuration } from './configurationStore'
import { dashboad_Settings } from './dashboardSettingsStore'

export default {
  install: (app: any) => {
    const authStore = auth()
    const mainStore = Store()
    const configurationStore = configuration()
    const dashboardSettings = dashboad_Settings()

    app.config.globalProperties.$auth = authStore
    app.config.globalProperties.$store = mainStore
    app.config.globalProperties.$dashboard = dashboardSettings
    app.config.globalProperties.$configuration = configurationStore

    mainStore.initializeStateFromStorage()
    dashboardSettings.initializeStateFromStorage()
  }
}
