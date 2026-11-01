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
      let root = document.querySelector(':root')

      let primaryColor = import.meta.env.VITE_THEME_PRIMARY_COLOR || 'white'
      let secondaryColor = import.meta.env.VITE_THEME_SECONDARY_COLOR || 'gainsboro'

      root?.style?.setProperty('--primary-color', primaryColor)
      root?.style?.setProperty('--secondary-color', secondaryColor)
    },
    setEnvTitle() {
      document.title = import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'
    },
    setFavicon() {
      let faviconUrl = import.meta.env.VITE_FAVICON_URL || '/tab_icon.png'
      let headTitle = document.querySelector('head')
      let setFavicon = document.createElement('link')

      setFavicon.setAttribute('rel', 'icon')
      setFavicon.setAttribute('href', faviconUrl)
      headTitle?.appendChild(setFavicon)
    }
  }
})
</script>
