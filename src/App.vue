<template>
  <the-dashboard />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheDashboard from './views/Dashboard.vue'

export default defineComponent({
  name: 'App',

  components: { TheDashboard },

  mounted() {
    this.setFavicon()
    this.setEnvVarColors()
    this.setEnvTitle()
  },

  methods: {
    setEnvVarColors() {
      let root = document.documentElement

      let primaryColor = import.meta.env.VITE_THEME_PRIMARY_COLOR || 'white'
      let secondaryColor = import.meta.env.VITE_THEME_SECONDARY_COLOR || 'gainsboro'

      root.style.setProperty('--primary-color', primaryColor)
      root.style.setProperty('--secondary-color', secondaryColor)
    },
    setEnvTitle() {
      document.title = import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'
    },
    setFavicon() {
      let faviconUrl = import.meta.env.VITE_FAVICON_URL || this.defaultFaviconUrl()
      let headTitle = document.querySelector('head')
      let setFavicon = document.createElement('link')

      setFavicon.setAttribute('rel', 'icon')
      setFavicon.setAttribute('href', faviconUrl)
      headTitle?.appendChild(setFavicon)
    },
    // Matches TheLogo.vue's ticket mark, tinted with the configured primary color
    // (favicons can't pick up CSS variables/classes, so the color is baked in here).
    defaultFaviconUrl() {
      let primaryColor = import.meta.env.VITE_THEME_PRIMARY_COLOR || 'white'
      let svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">` +
        `<path fill="${primaryColor}" d="M65,160 h470 a25,25 0 0 1 25,25 v65 a40,40 0 0 0 0,80 ` +
        `v65 a25,25 0 0 1 -25,25 h-470 a25,25 0 0 1 -25,-25 v-65 a40,40 0 0 0 0,-80 v-65 ` +
        `a25,25 0 0 1 25,-25 z"/></svg>`

      return `data:image/svg+xml,${encodeURIComponent(svg)}`
    }
  }
})
</script>
