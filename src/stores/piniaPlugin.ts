import { Store } from './index'
import { dashboad_Settings } from './dashboardSettingsStore'
import { configuration } from './configurationStore'

export default {
  install: (app: any) => {
    const mainStore = Store()
    const configurationStore = configuration()
    const dashboardSettings = dashboad_Settings()

    app.config.globalProperties.$store = mainStore
    app.config.globalProperties.$dashboard = dashboardSettings
    app.config.globalProperties.$configuration = configurationStore

    mainStore.initializeStateFromStorage()
    dashboardSettings.initializeStateFromStorage()
  }
}
