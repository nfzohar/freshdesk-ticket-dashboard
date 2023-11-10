<template>
  <div class="w-screen h-screen overflow-hidden"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LandingPage',

  computed: {
    themePrimaryColor() {
      return ''
    },
    themeSecondaryColor() {
      return ''
    }
  }

  // created() {
  //   this.$router.push('/login')
  // }
})
</script>
