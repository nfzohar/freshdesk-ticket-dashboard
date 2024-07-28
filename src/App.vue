<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { colorIsDark } from './helpers/CommonMethods'

export default defineComponent({
  name: 'App',

  mounted() {
    this.setFavicon()
    this.setTextColorByBAckgroud()
    this.setEnvVarColors()
    this.setEnvTitle()
  },

  methods: {
    setTextColorByBAckgroud() {
      let bgIsDark = colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR)
      document.body.style.color = bgIsDark ? 'white' : 'black'
    },
    setEnvVarColors() {
      let root = document.querySelector(':root')

      let primaryColor = import.meta.env.VITE_THEME_SECONDARY_COLOR || 'white'
      let secondaryColor = import.meta.env.VITE_THEME_SECONDARY_COLOR || 'gainsboro'

      root?.style?.setProperty(primaryColor, '--primary-color')
      root?.style?.setProperty(secondaryColor, '--secondary-color')
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
