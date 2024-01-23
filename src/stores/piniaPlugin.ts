import { Store } from './index'
import { dashboad_Settings } from './dashboardSettingsStore'

export default {
  install: (app: any) => {
    const mainStore = Store()
    const dashboardSettings = dashboad_Settings()

    app.config.globalProperties.$store = mainStore
    app.config.globalProperties.$dashboard = dashboardSettings

    mainStore.initializeStateFromStorage()
    dashboardSettings.initializeStateFromStorage()
  }
}
