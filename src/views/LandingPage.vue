<template>
  <div class="dashboard-body">
    <div class="m-auto w-min align-middle mt-44 animate-spin">
      <logo-icon pt-width="300" pt-height="300" class="shadow-lg rounded-full" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '@/components/general/TheLogo.vue'

export default defineComponent({
  name: 'LandingPage',

  components: { LogoIcon },

  created() {
    document.title = import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'

    if (localStorage.getItem('stored_auth_state')) {
      this.$router.push('/dashboard')
    } else {
      setTimeout(() => {
        this.$router.push('/login')
      }, 500)
    }
  }
})
</script>
