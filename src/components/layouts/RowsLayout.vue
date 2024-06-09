<template>
  <div class="flex w-full h-screen overflow-y-scroll p-2 scrollbar-hide gap-y-5 flex-col">
    <div class="w-full h-full border flex gap-x-5 p-2">
      <component :tickets="allTickets" :is="'AgentsLeaderboard'" />
      <component :tickets="allTickets" :is="'RequestersLeaderboard'" />
    </div>
    <div class="w-full h-full border flex gap-x-5 p-2">
      <component :tickets="allTickets" :is="'TicketTagsList'" />
      <component :tickets="allTickets" :is="'TicketGroupsList'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RowsLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  }
})
</script>
