<template>
  <div
    :key="visibleTicketCounts?.length"
    class="flex gap-5 w-full rounded-md items-center justify-between"
  >
    <template v-for="(status, s) in statusLabels" :key="s">
      <div
        v-if="visibleTicketCounts.includes(status)"
        class="block rounded-md w-full h-auto bg-primary-500 text-center align-middle font-bold p-5"
        :class="`text-${darkPrimaryColor ? 'white' : 'black'}`"
      >
        <span v-text="status" />
        <span class="block text-6xl w-full" v-text="generateTicketCount(status)" />
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
    return { groupedByStatus: [] }
  },

  watch: {
    'tickets.length'() {
      this.statusGroupedTickets = groupBy(this.tickets, 'status')
    }
  },

  computed: {
    darkPrimaryColor(): Boolean {
      return this.$information?.isPrimaryColorDark
    },
    statusGroupedTickets(): any {
      return groupBy(this.tickets, 'status') ?? []
    },
    statuses(): any {
      return Object.values(this.$information?.statuses) ?? []
    },
    visibleTicketCounts(): any {
      return Object.values(this.$configuration?.visibleTicketCounts) ?? []
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
        case 'All': {
          return this.tickets?.length
        }
        case 'Unresolved': {
          let resolved = [this.getStatusId('Closed'), this.getStatusId('Resolved')]
          return this.tickets?.filter((ticket) => !resolved.includes(ticket?.status)).length
        }
        default: {
          let statusId = this.getStatusId(status)
          return this.statusGroupedTickets[statusId]?.length ?? 0
        }
      }
    },

    getStatusId(statusLabel: string) {
      if (!this.statuses?.length) {
        return 0
      }
      return this.statuses?.filter((status) => status.label == statusLabel)[0].id ?? 0
    }
  }
})
</script>
