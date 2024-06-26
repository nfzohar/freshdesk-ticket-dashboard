<template>
  <div class="dashboard-body is-loading" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogoutPage',

  async created() {
    this.$auth.logout()

    setTimeout(() => {
      this.$router.push('/login')
    }, 500)
  }
})
</script>
