import { Store } from './index'

export default {
  install: (app) => {
    const theStore = Store()

    app.config.globalProperties.$store = theStore
  }
}
