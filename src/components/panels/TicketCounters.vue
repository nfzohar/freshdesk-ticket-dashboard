<template>
  <div
    :key="hiddenTicketCounters?.length"
    class="flex gap-5 w-full rounded-md items-center justify-between"
  >
    <template v-for="(status, s) in statusLabels" :key="s">
      <div class="block rounded-md w-full h-full bg-primary-500 text-center align-middle font-bold p-5">
        <span class="block text-7xl w-full" v-text="generateTicketCount(status)" />
        <span v-text="status" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TicketCounters',

  props: {
    tickets: {
      type: [Object, Array],
      required: true,
      default: () => []
    }
  },

  data() {
    return {
      groupedByStatus: []
    }
  },

  watch: {
    'tickets.length'() {
      //this.statusGroupedTickets = groupBy(this.tickets, 'status')
    }
  },

  computed: {
    statuses(): any {
      return Object.values(this.$information?.statuses) ?? []
    },
    hiddenTicketCounters(): any {
      return this.$configuration?.hiddenTicketCounts ?? []
    },
    statusGroupedTickets(): any {
      return groupBy(this.tickets, 'status') ?? []
    },
    statusLabels(): any {
      let labels = this.statuses.map((status) => status?.label)
      labels.unshift('All', 'Unresolved')
      return labels
    }
  },

  methods: {
    generateTicketCount(status: string): number {
      switch (status) {
        default:
          return this.statusGroupedTickets[this.getStatusId(status)]?.length ?? 0
        case 'All':
          return this.tickets?.length
        case 'Unresolved':
          return this.tickets?.filter(
            (ticket) =>
              ![this.getStatusId('Closed'), this.getStatusId('Resolved')].includes(ticket?.status)
          ).length
      }
    },

    getStatusId(statusLabel: string) {
      return 0

      if (!this.statuses?.length) {
        return 0
      }

      return this.statuses?.filter((status) => status.label == statusLabel)[0].id ?? 0
    }
  }
})
</script>
