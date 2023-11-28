<template>
  <div
    class="flex flex-col rounded-md w-full bg-primary-500 hover:bg-primary-600 border-secondary-600 px-3 py-2"
    :key="ticketCount"
  >
    <span class="font-bold" v-text="name" />

    <span class="text-sm">
      <span class="font-semibold" v-text="'Count of tickets: '" />
      <span v-text="ticketCount" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ACustomField',

  props: {
    customField: {
      type: [Object, Array],
      required: false,
      default: () => []
    }
  },

  computed: {
    name() {
      return this.customField?.name ?? 'Custom Field'
    },
    ticketCount() {
      return this.customField?.ticket_count ?? 0
    }
  }
})
</script>
