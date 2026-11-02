<template>
  <a-dialog
    size="xl"
    icon="fa fa-list"
    :title="'Tickets'"
    :subtitle="`${tickets?.length ?? 0} tickets loaded`"
  >
    <template #trigger>
      <button class="actions-button" :title="'Show list of all tickets'" @click="setTicketId(null)">
        <i class="fa fa-list" />
      </button>
    </template>

    <template #content>
      <div :key="(tickets?.length, selectedTicketId)">
        <ticket-details
          v-if="selectedTicketId"
          :ticket-id="selectedTicketId"
          @closeDetails="setTicketId(null)"
        />
        <template v-else>
          <div
            v-if="tickets?.length"
            class="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 -mr-1"
          >
            <template v-for="(ticket, t) in tickets" :key="t">
              <a-ticket v-if="ticket?.id" :the-ticket="ticket" @click="setTicketId(ticket?.id)" />
            </template>
          </div>
          <p
            v-else
            class="py-10 text-center text-sm text-ink-muted"
            v-text="'No tickets loaded.'"
          />
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
    setTicketId(id: number) {
      this.selectedTicketId = id
    }
  }
})
</script>
