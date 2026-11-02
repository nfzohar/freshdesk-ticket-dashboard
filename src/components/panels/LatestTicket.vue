<template>
  <a-panel :title="`Latest ticket (#${latestTicket?.id})`" :show-view-switch="false">
    <template #defaultView>
      <a-dialog size="xl" icon="fa fa-ticket" :title="'Latest ticket'">
        <template #trigger>
          <div class="p-3">
            <a-ticket
              v-if="tickets?.length"
              :the-ticket="latestTicket"
              :mode="'panel-content'"
              @click="showModal = true"
            />
            <span v-else class="text-sm text-ink-muted" v-text="'No tickets to display.'" />
          </div>
        </template>

        <template #content>
          <div :key="(tickets?.length, latestTicket?.id)">
            <ticket-details
              v-if="showModal"
              :show-back-button="false"
              :ticket-id="latestTicket?.id"
              @closeDetails="showModal = false"
            />
          </div>
        </template>
      </a-dialog>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import APanel from '@/components/general/APanel.vue'
import ADialog from '@/components/general/ADialog.vue'
import ATicket from '@/components/general/ATicket.vue'
import TicketDetails from '@/components/general/TicketDetails.vue'

export default defineComponent({
  name: 'AllTicketsList',

  components: { APanel, ATicket, ADialog, TicketDetails },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return { showModal: false }
  },

  computed: {
    latestTicket(): any {
      return this.tickets[0]
    }
  }
})
</script>
