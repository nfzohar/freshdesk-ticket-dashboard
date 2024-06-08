<template>
  <div class="w-full">
    <div class="flex items-center justify-between">
      <a-section-title
        :the-text="'Tickets'"
        :section-visible="showSection"
        :show-switch-button="false"
        :show-recolor-button="false"
        @toggleVisibility="showSection = !showSection"
      />

      <h1
        v-if="showSection"
        class="w-44 text-right"
        :title="'Showing: ' + ticketsList?.length + ' tickets'"
        v-text="'Showing: ' + ticketsList?.length"
      />
    </div>

    <div
      v-if="showSection && ticketsList?.length"
      class="flex flex-col gap-y-4 w-full overflow-y-scroll scrollbar-hide rounded-md shadow-md shadow-primary-600 p-3 mb-5"
      style="max-height: 55vh"
    >
      <template v-for="(ticket, t) in ticketsList" :key="t">
        <a-ticket
          v-if="ticket"
          :the-ticket="ticket"
          :statuses="statuses"
          @click="$emit('showTicketDetails', ticket.id)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ATicket from '@/components/subcomponents/ATicket.vue'
import ASectionTitle from '@/components/General/ASectionTitle.vue'

export default defineComponent({
  name: 'TicketListSection',

  components: { ATicket, ASectionTitle },

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
