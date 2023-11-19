<template>
  <div class="w-full">
    <h1 class="text-xl font-bold opacity-40" v-text="'Tickets'" />
    <div
      class="flex flex-col gap-y-4 w-full overflow-y-scroll scrollbar-hide rounded-md shadow-md shadow-primary-600 p-3 mb-5"
    >
      <a-ticket v-for="(ticket, t) in ticketsList" :key="t" :the-ticket="ticket" />
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
    }
  },

  data() {
    return {
      filters: [
        'Agents',
        'Groups',
        'Created at',
        'Status',
        'Priority',
        'Type',
        'Source',
        'Tags',
        'Companies',
        'Contacts'
      ]
    }
  },

  computed: {
    activeFilters() {
      return !this.filters.length > 0
    }
  }
})
</script>
