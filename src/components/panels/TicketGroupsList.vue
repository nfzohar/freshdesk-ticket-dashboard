<template>
  <a-panel :title="'Groups'" :datasets="dataset" :dataset-labels="datasetLabels">
    <template #defaultView>
      <div
        :key="ticketGroups?.length"
        class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center justify-between w-full p-2 border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
        :class="'overflow-y-scroll scrollbar-hide'"
        style="max-height: 50vh"
      >
        <a-card
          v-for="(group, g) in ticketGroups"
          :key="g"
          :name="group?.name"
          :count="group?.ticket_count"
        />
      </div>
    </template>
  </a-panel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { groupBy, sortBy, get } from 'lodash'
import ApiCall from '@/helpers/APICallHelper'
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'

export default defineComponent({
  name: 'TicketGroupsList',

  components: { APanel, ACard },

  props: {
    tickets: {
      type: [Array, Object],
      required: false,
      default: () => {}
    }
  },

  data() {
    return {
      groups: [],
      ticketGroups: Array()
    }
  },

  computed: {
    dataset() {
      return Object.values(this.ticketGroups?.map((group) => group?.ticket_count))
    },
    datasetLabels() {
      return Object.values(this.ticketGroups?.map((group) => group?.name))
    }
  },

  watch: {
    'tickets.length'() {
      this.getGroupTicketCounts()
    }
  },

  async created() {
    await this.fetchTicketGroups()
  },

  methods: {
    async fetchTicketGroups() {
      if (!this.$configuration.storedGroups?.length) {
        this.groups = []

        await ApiCall.get('groups?per_page=100')
          .then((response) => {
            if (response) {
              this.groups = response
            }
          })
          .then(() => {
            this.getGroupTicketCounts()
          })
          .then(() => {
            this.$configuration.setGroups(this.groups)
          })
      }
    },

    async getGroupTicketCounts() {
      this.ticketGroups = []
      let ticketsGrouped = groupBy(this.tickets, 'group_id')

      Object.values(this.groups).forEach((group) => {
        if (group) {
          this.ticketGroups.push({
            name: group?.name,
            ticket_count: Number(ticketsGrouped[group?.id]?.length)
          })
        }
      })

      this.ticketGroups = sortBy(this.ticketGroups, 'ticket_count')
      this.ticketGroups.reverse()
    }
  }
})
</script>
