import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '/src/views/LandingPage.vue'
import LoginPage from '/src/views/LoginPage.vue'
import Dashboard from '/src/views/Dashboard.vue'

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
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    }
  ]
})

export default router
