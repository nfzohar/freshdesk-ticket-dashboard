import type { ToastInterface } from 'vue-toastification'
import type { auth } from '@/stores/auth'
import type { information } from '@/stores/information'
import type { configuration } from '@/stores/configuration'

// Registered as app.config.globalProperties in stores/index.ts and main.ts.
declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: ReturnType<typeof auth>
    $information: ReturnType<typeof information>
    $configuration: ReturnType<typeof configuration>
    $toast: ToastInterface
  }
}

export {}
