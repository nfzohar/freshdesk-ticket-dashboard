<template>
  <div class="w-screen h-screen overflow-hidden bg-secondary-500">
    <div class="m-auto w-96 p-5 shadow-primary-500 text-center mt-52 shadow-xl rounded-xl">
      <h1 class="font-bold text-9xl" v-text="404" />
      <span class="block font-semibold" v-text="'Page not found.'" />
      <button
        class="primary-button p-1 w-23 mt-5 font-semibold"
        v-text="'Home'"
        @click="$router.push('/')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Page404'
})
</script>
