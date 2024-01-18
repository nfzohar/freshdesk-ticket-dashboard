<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <h1
        class="w-full text-xl font-bold mb-1 cursor-pointer"
        :class="{ 'border-l-4 pl-2 border-primary-400': !showSection }"
        v-text="'Tickets'"
        @click.stop="showSection = !showSection"
      />

      <h1
        class="conf-semibold"
        :title="'Showing: ' + ticketsList.length + ' tickets'"
        v-text="'Showing: ' + ticketsList.length"
      />
    </div>

    <div
      v-if="showSection"
      class="flex flex-col gap-y-4 w-full overflow-y-scroll scrollbar-hide rounded-md shadow-md shadow-primary-600 p-3 mb-5"
      style="max-height: 55vh"
    >
      <a-ticket
        v-for="(ticket, t) in ticketsList"
        :key="t"
        :the-ticket="ticket"
        :statuses="statuses"
        @click="$emit('showTicketDetails', ticket.id)"
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

  emits: ['showTicketDetails'],

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
  },

  data() {
    return { showSection: true }
  }
})
</script>
