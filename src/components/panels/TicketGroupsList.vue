<template>
  <a-panel :title="'Groups'" :datasets="graph?.values" :dataset-labels="graph?.labels">
    <template #defaultView>
      <div
        :key="ticketGroups?.length"
        class="panel-body lg:grid-cols-2"
        :class="'overflow-y-scroll scrollbar-hide'"
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
import { groupBy, sortBy } from 'lodash'
import ACard from '@/components/general/ACard.vue'
import APanel from '@/components/general/APanel.vue'
import { generateGraphDataset } from '@/helpers/CommonMethods'

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
    graph() {
      return generateGraphDataset(this.ticketGroups)
    }
  },

  watch: {
    'tickets.length'() {
      this.getGroupTicketCounts()
    }
  },

  async mounted() {
    this.getGroupTicketCounts()
  },

  methods: {
    async getGroupTicketCounts() {
      this.groups = this.$information.storedGroups

      let ticketsGrouped = groupBy(this.tickets, 'group_id')
      this.ticketGroups = []

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
