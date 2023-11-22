<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold" v-text="'Tickets'" />
      <h1
        class="conf-semibold"
        :title="'Showing: ' + ticketsList.length + ' tickets'"
        v-text="'Showing: ' + ticketsList.length"
      />
    </div>

    <div
      class="flex flex-col gap-y-4 w-full overflow-y-scroll scrollbar-hide rounded-md shadow-md shadow-primary-600 p-3 mb-5"
      style="max-height: 55vh"
    >
      <a-ticket
        v-for="(ticket, t) in ticketsList"
        :key="t"
        :the-ticket="ticket"
        :statuses="statuses"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ATicket from '@/components/subcomponents/ATicket.vue'

export default defineComponent({
  name: 'TicketListSection',

  components: { ATicket },

  props: {
    ticketsList: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    statuses: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  }
})
</script>
