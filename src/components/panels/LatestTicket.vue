<template>
  <a-panel :title="'Latest ticket'" :show-view-switch="false">
    <template #defaultView>
      <a-dialog>
        <template #trigger>
          <div class="p-2">
            <a-ticket v-if="tickets?.length" :the-ticket="latestTicket" @click="showModal = true" />
            <span v-else class="opacity-50" v-text="'No tickets to display.'" />
          </div>
        </template>

        <template #content>
          <div
            class="m-auto w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-7/12 h-90vh bg-secondary-500 border-primary-500 border rounded-md p-5 overflow-hidden text-white"
            :key="(tickets?.length, latestTicket?.id)"
          >
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
    latestTicket(): Object {
      return this.tickets[0]
    }
  }
})
</script>
