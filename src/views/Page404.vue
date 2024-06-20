<template>
  <div class="dashboard-body">
    <div
      class="m-auto w-96 p-5 shadow-primary-500 text-center mt-52 shadow-xl border border-primary-500 rounded-xl"
    >
      <h1 class="font-bold text-9xl w-full" v-text="'404'" />
      <hr class="my-5" />
      <span class="block font-semibold w-full" v-text="'Page not found.'" />
      <button
        class="primary-button border-secondary-500 px-3 py-1 w-23 h-10 mt-5 font-semibold"
        v-text="'Home'"
        @click="$router.push('/')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageNotFound'
})
</script>
