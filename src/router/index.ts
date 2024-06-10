import { createRouter, createWebHistory } from 'vue-router'
import ConfigWizard from '@/views/ConfigurationWizard.vue'
import LandingPage from '@/views/LandingPage.vue'
import LogoutPage from '@/views/LogoutPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import Page404 from '@/views/Page404.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/setup',
      name: 'configuration-wizard',
      component: ConfigWizard
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: Page404
    }
  ]
})

export default router
