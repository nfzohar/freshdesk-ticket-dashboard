<template>
  <a-dialog custom-class="-mt-28 md:-mt-14">
    <template #trigger>
      <button class="actions-button fa fa-table-list" :title="'Show list of all tickets'" />
    </template>

    <template #content>
      <div
        class="m-auto w-full lg:w-9/12 h-full bg-secondary-500 border-primary-500 border rounded-md p-5 scrollbar-hide overflow-y-scroll"
        :class="'text-white'"
        :key="allTickets?.length"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <h1 class="text-left font-bold" v-text="'Tickets'" />
            <h1 class="w-auto text-right" v-html="`Showing: <b>${allTickets?.length}</b>`" />
          </div>

          <hr class="my-2 border border-primary-500" />
          <div
            v-if="allTickets?.length"
            class="flex flex-col gap-y-4 w-full rounded-md shadow-primary-600"
          >
            <template v-for="(ticket, t) in allTickets" :key="t">
              <a-ticket
                v-if="ticket"
                :the-ticket="ticket"
                :statuses="statuses"
                @click="$emit('showTicketDetails', ticket.id)"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ATicket from '@/components/general/ATicket.vue'

export default defineComponent({
  name: 'AllTicketsList',

  components: { ATicket, ADialog },

  emits: ['showTicketDetails'],

  props: {
    allTickets: {
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
