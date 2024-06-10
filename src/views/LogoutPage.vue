<template>
  <div class="w-screen h-screen overflow-hidden bg-secondary-500">
    <div class="m-auto w-min align-middle mt-44 animate-spin">
      <logo-icon pt-width="300" pt-height="300" class="shadow-lg rounded-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '@/components/general/TheLogo.vue'

export default defineComponent({
  name: 'LogoutPage',

  components: { LogoIcon },

  async created() {
    this.$store.canAuthenticate(false)

    setTimeout(() => {
      this.$router.push('/login')
    }, 500)
  }
})
</script>
