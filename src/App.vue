<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { colorIsDark } from './helpers/CommonMethods'

export default defineComponent({
  name: 'App',

  mounted() {
    this.setTextColorByBAckgroud()
    this.setEnvVarColors()
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
    }
  }
})
</script>
