<template>
  <a-dialog>
    <template #trigger>
      <button
        class="actions-button fa fa-list"
        :title="'Show list of all tickets'"
        @click="setTicketId(null)"
      />
    </template>

    <template #content>
      <div
        class="m-auto w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-7/12 h-90vh bg-secondary-500 border-primary-500 border rounded-md p-5 overflow-hidden text-white"
        :key="(tickets?.length, selectedTicketId)"
      >
        <ticket-details
          v-if="selectedTicketId"
          :ticket-id="selectedTicketId"
          @closeDetails="setTicketId(null)"
        />
        <template v-else>
          <div class="flex items-center justify-between">
            <span class="text-left font-bold" v-text="'Tickets'" />
            <span class="w-auto text-right" v-html="`Showing: <b>${tickets?.length}</b>`" />
          </div>

          <hr class="my-2 border border-primary-500" />
          <div
            v-if="tickets?.length"
            class="flex flex-col gap-y-4 w-full h-80vh rounded-md shadow-primary-600 scrollbar-hide overflow-y-scroll"
          >
            <template v-for="(ticket, t) in tickets" :key="t">
              <a-ticket v-if="ticket?.id" :the-ticket="ticket" @click="setTicketId(ticket?.id)" />
            </template>
          </div>
        </template>
      </div>
    </template>
  </a-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ADialog from '@/components/general/ADialog.vue'
import ATicket from '@/components/general/ATicket.vue'
import TicketDetails from '@/components/general/TicketDetails.vue'

export default defineComponent({
  name: 'AllTicketsList',

  components: { ATicket, ADialog, TicketDetails },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return { selectedTicketId: null }
  },

  methods: {
    setTicketId(id: Number) {
      this.selectedTicketId = id
    }
  }
})
</script>
