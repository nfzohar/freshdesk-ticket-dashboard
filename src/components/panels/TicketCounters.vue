<template>
  <div
    :key="visibleCounters?.length"
    :class="`grid grid-cols-2 gap-5 w-full rounded-md overflow-y-scroll scrollbar-hide ${conditionalStyle}`"
  >
    <template v-for="(status, s) in visibleCounters" :key="(s, visibleCounters?.length)">
      <div
        class="block rounded-md w-full h-full bg-primary-500 text-center align-middle font-bold p-5"
        :class="`text-${darkPrimaryColor ? 'white' : 'black'}`"
      >
        <span class="block text-6xl w-full h-16" v-text="generateTicketCount(status)" />
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
    return { groupedByStatus: [] }
  },

  watch: {
    'tickets.length'() {
      this.statusGroupedTickets = groupBy(this.tickets, 'status')
    }
  },

  computed: {
    layout(): String {
      return this.$configuration?.layoutComponent
    },
    darkPrimaryColor(): Boolean {
      return this.$information?.isPrimaryColorDark
    },
    statuses(): any {
      return Object.values(this.$information?.statuses ?? [])
    },
    statusGroupedTickets(): any {
      return this.tickets?.length ? groupBy(this.tickets, 'status') : []
    },
    visibleCounters(): Array {
      return Object.values(this.$configuration?.visibleTicketCounts ?? [])
    },
    validStatuses(): any {
      let labels = this.statuses.map((status) => status?.label)
      labels.unshift('All', 'Unresolved')
      return labels
    },
    conditionalStyle() {
      if (this.layout == 'rows-layout' || this.layout == 'spin-layout') {
        return 'sm:flex flex-row max-w-screen items-center justify-between'
      }
      if (this.layout == 'columns-layout') {
        let grid = this.visibleCounters?.length > 7 ? 'grid grid-cols-2' : 'sm:flex flex-col'
        return `h-full ${grid}`
      }
      return ''
    }
  },

  methods: {
    generateTicketCount(status: string): number {
      if (this.validStatuses.includes(status)) {
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
      }
    },

    getStatusId(statusLabel: string) {
      return this.statuses?.length
        ? this.statuses?.filter((status) => status.label == statusLabel)[0].id ?? 0
        : 0
    }
  }
})
</script>
