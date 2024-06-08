<template>
  <div class="flex w-full h-screen overflow-y-scroll p-2 scrollbar-hide gap-x-5">
    <div class="w-full h-full border"></div>
    <div class="w-full h-full border"></div>
    <div class="w-full h-full border"></div>
    <div class="w-full h-full border"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ColumnsLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  }
})
</script>
