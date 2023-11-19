import { Store } from './index'
import { dashboad_Settings } from './dashboardSettingsStore'

export default {
  install: (app) => {
    const defaultStore = Store()
    const dashboardSettings = dashboad_Settings()

    app.config.globalProperties.$store = defaultStore
    app.config.globalProperties.$dashboard = dashboardSettings
  }
}
