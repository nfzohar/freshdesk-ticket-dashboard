import { createApp, defineAsyncComponent } from 'vue'
import AToast from '@/components/general/AToast.vue'
import { useToast } from 'vue-toastification'
import Toast from 'vue-toastification'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import './index.css'
import 'vue-toastification/dist/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
// import '@fortawesome/fontawesome-free/js/all.js'

import plugin from './stores/index'

const pinia = createPinia()
const app = createApp(App)

//Register store
app.use(pinia)
app.use(plugin)

//Register router
app.use(router)

//Register Toast in app
app.use(Toast, {
  AToast,
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: AToast,
  newestOnTop: true,
  maxToasts: 1,
  icon: true,
  rtl: false
})

// Register Toast globally
app.config.globalProperties.$toast = useToast()

// Register components in folders globally
const globalComponentFolders = [
  import.meta.glob('@/components/layouts/*'),
  import.meta.glob('@/components/panels/*')
]

globalComponentFolders.forEach((folder) => {
  Object.entries(folder).map(([path, importFn]) => {
    const parts = path.split('/')
    const filename = parts[parts.length - 1]
    const componentName = filename.slice(0, -4)

    app.component(
      componentName,
      defineAsyncComponent(() => importFn())
    )
  })
})

app.mount('#app')
