import AToast from '@/components/General/AToast.vue'
import { useToast } from 'vue-toastification'
import Toast from 'vue-toastification'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
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
  timeout: false,
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

app.mount('#app')
