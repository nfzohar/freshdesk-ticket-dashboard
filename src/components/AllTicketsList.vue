<template>
  <a-dialog custom-class="-mt-28 md:-mt-14" :manual-open="showAllTicketsList">
    <template #trigger>
      <button
        class="actions-button fa fa-table-list"
        :title="'Show list of all tickets'"
        @click="showAllTicketsList = true"
      />
    </template>

    <template #content>
      <div
        class="m-auto w-9/12 bg-secondary-500 border-primary-500 border rounded-md p-5"
        :class="'text-white'"
      >
        <div class="w-full">
          <div class="flex items-center justify-between">
            <a-section-title
              :the-text="'Tickets'"
              :section-visible="showAllTicketsList"
              :show-switch-button="false"
              :show-recolor-button="false"
              @toggleVisibility="showAllTicketsList = !showAllTicketsList"
            />
            <h1
              v-if="showAllTicketsList"
              class="w-44 text-right"
              :title="'Showing: ' + allTickets?.length + ' tickets'"
              v-text="'Showing: ' + allTickets?.length"
            />
          </div>

          <div
            v-if="showAllTicketsList && allTickets?.length"
            class="flex flex-col gap-y-4 w-full overflow-y-scroll scrollbar-hide rounded-md shadow-md shadow-primary-600 p-3 mb-5"
            style="max-height: 55vh"
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
import ATicket from '@/components/subcomponents/ATicket.vue'
import ASectionTitle from '@/components/general/ASectionTitle.vue'

export default defineComponent({
  name: 'TicketListSection',

  components: { ATicket, ASectionTitle, ADialog },

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
  },

  data() {
    return { showAllTicketsList: true }
  }
})
</script>
