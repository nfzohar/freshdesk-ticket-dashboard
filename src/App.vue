<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { colorIsDark } from './helpers/CommonMethods'

export default defineComponent({
  name: 'App',

  mounted() {
    let bgIsDark = colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR)
    document.body.style.color = bgIsDark ? 'white' : 'black'
  }
})
</script>
