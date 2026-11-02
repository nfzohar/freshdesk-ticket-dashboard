<template>
  <div
    :key="visibleCounters?.length"
    :class="`grid gap-3 w-full overflow-y-auto scrollbar-hide ${conditionalStyle}`"
  >
    <template v-for="(status, s) in visibleCounters" :key="(s, visibleCounters?.length)">
      <div class="card relative w-full h-full overflow-hidden px-5 py-4">
        <span class="absolute inset-x-0 top-0 h-1 bg-primary-500" aria-hidden="true" />
        <span class="block text-sm font-medium text-ink-muted truncate" v-text="status" />
        <span
          class="block mt-1 text-4xl font-semibold tabular-nums tracking-tight"
          v-text="generateTicketCount(status)"
        />
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

  computed: {
    layout(): string {
      return this.$configuration?.layoutComponent
    },
    darkPrimaryColor(): boolean {
      return this.$information?.isPrimaryColorDark
    },
    statuses(): any {
      return Object.values(this.$information?.storedStatuses ?? [])
    },
    statusGroupedTickets(): any {
      return this.tickets?.length ? groupBy(this.tickets, 'status') : []
    },
    visibleCounters(): Array<any> {
      return Object.values(this.$configuration?.visibleTicketCounts ?? [])
    },
    validStatuses(): any {
      let labels = this.statuses.map((status: any) => status?.label)
      labels.unshift('All', 'Unresolved')
      return labels
    },
    conditionalStyle() {
      if (this.layout == 'spin-layout') {
        return 'grid-cols-2 md:grid-cols-3 lg:flex flex-row max-w-screen items-center justify-between'
      }
      // Grid and mobile: as many tiles per row as fit, filling the panel's cell.
      return 'h-full content-start grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]'
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
            return this.tickets?.filter((ticket: any) => !resolved.includes(ticket?.status)).length
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
        ? this.statuses?.filter((status: any) => status.label == statusLabel)[0]?.id ?? 0
        : 0
    }
  }
})
</script>
