import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Tippy from 'vue-tippy'
import router from './router'
import App from './App.vue'

import './index.css'
import piniaPlugin from './stores/piniaPlugin'

const app = createApp(App)
const pinia = createPinia()

//Register store
app.use(pinia).use(piniaPlugin)

//Register router
app.use(router)

//Register tippy
app.use(Tippy, {
  defaultProps: {
    trigger: 'click',
    interactive: true,
    arrrow: true,
    duration: 0
  }
})

app.mount('#app')
