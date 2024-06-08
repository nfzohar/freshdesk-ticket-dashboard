import { createApp, defineAsyncComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AToast from '@/components/General/AToast.vue'
import { useToast } from 'vue-toastification'
import Toast from 'vue-toastification'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import the CSS or use your own!
import './index.css'
import 'vue-toastification/dist/index.css'
import piniaPlugin from './stores/piniaPlugin'

const app = createApp(App)
const pinia = createPinia()

//Register store
app.use(pinia)
app.use(piniaPlugin)

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
  maxToasts: 5,
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
