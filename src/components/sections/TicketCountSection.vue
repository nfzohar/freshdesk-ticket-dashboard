<template>
  <div
    v-if="visibleCounts.length > 0"
    :key="visibleCounts?.length"
    class="gap-5 w-full rounded-md px-10 items-center justify-between"
    :class="
      visibleCounts?.length > 10
        ? 'flex items-center justify-between'
        : 'grid grid-cols-1 sm:grid-cols-2' + getConditionalGridStyle()
    "
  >
    <template v-for="(status, s) in allStatusLabels" :key="s">
      <div
        v-if="visibleCounts?.includes(status)"
        :key="tickets?.length"
        class="block mb-3 md:mb-0 rounded-md border border-primary-500 shadow-md h-full shadow-primary-600 bg-primary-500 hover:bg-primary-600 py-5 px-2 w-full text-center font-bold"
      >
        <span class="block text-7xl w-full" v-text="countTicketsOfStatus(status)" />
        <span v-text="status" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { groupBy } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TicketStatisticsSection',

  props: {
    tickets: {
      type: [Object, Array],
      required: true,
      default: () => []
    }
  },

  data() {
    return {
      statusGroupedTickets: []
    }
  },

  watch: {
    'tickets.length'() {
      this.statusGroupedTickets = groupBy(this.tickets, 'status')
    }
  },

  computed: {
    statuses(): any {
      return Object.values(this.$dashboard?.statuses) ?? []
    },
    allStatusLabels(): any {
      let labels = this.statuses.map((status) => status?.label)
      labels.unshift('All', 'Unresolved')
      return labels
    },
    visibleCounts(): any {
      return this.$dashboard?.layout?.ticket_counts?.visibleCounts ?? []
    }
  },

  mounted() {
    this.statusGroupedTickets = groupBy(this.tickets, 'status')
  },

  methods: {
    countTicketsOfStatus(status: string): number {
      if (status == 'All') {
        return this.tickets?.length
      }

      if (status == 'Unresolved') {
        return this.tickets?.filter(
          (ticket) =>
            ![this.getStatusId('Closed'), this.getStatusId('Resolved')].includes(ticket?.status)
        ).length
      }

      return this.statusGroupedTickets[this.getStatusId(status)]?.length ?? 0
    },

    getStatusId(statusLabel: string) {
      if (!this.statuses?.length) {
        return 0
      }

      return this.statuses?.filter((status) => status.label == statusLabel)[0].id ?? 0
    },

    getConditionalGridStyle() {
      let count = Number(this.visibleCounts?.length)

      if (count % 3 == 0) {
        return 'md:grid-cols-3'
      }
      if (count % 4 == 0) {
        return 'md:grid-cols-4'
      }
      if (count % 5 == 0) {
        return 'md:grid-cols-5'
      }
    }
  }
})
</script>
