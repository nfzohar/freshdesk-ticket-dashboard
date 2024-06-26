<template>
  <div class="dashboard-body is-loading" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LandingPage',

  created() {
    document.title = import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'

    if (this.$auth.authenticated) {
      this.$router.push('/dashboard')
      return
    }

    setTimeout(() => {
      this.$router.push('/login')
    }, 500)
  }
})
</script>
