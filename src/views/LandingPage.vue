<template>
  <div class="w-screen h-screen overflow-hidden bg-secondary-500">
    <div class="m-auto w-min align-middle mt-44 animate-spin">
      <logo-icon pt-width="300" pt-height="300" class="shadow-lg rounded-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '/src/components/icons/LogoIcon.vue'

export default defineComponent({
  name: 'LandingPage',

  components: { LogoIcon },

  created() {
    setTimeout(() => {
      this.$router.push('/login')
    }, 500)
  }
})
</script>
