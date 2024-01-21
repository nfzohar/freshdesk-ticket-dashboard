<template>
  <div
    v-if="visibleCounts.length > 0"
    :key="visibleCounts?.length"
    class="gap-5 w-full rounded-md px-10 items-center justify-between"
    :class="[
      visibleCounts.length > 10
        ? 'flex items-center justify-between'
        : 'grid grid-cols-1 sm:grid-cols-2 ' + getConditionalGridStyle()
    ]"
  >
    <template v-for="(stat, s) in statistics" :key="s">
      <div
        v-if="layoutTicketCounts?.visibleCounts?.includes(stat?.label)"
        class="block mb-3 md:mb-0 rounded-md border border-primary-500 shadow-md h-full shadow-primary-600 bg-primary-500 hover:bg-primary-600 py-5 px-2 w-full text-center font-bold"
      >
        <span class="block text-7xl w-full" v-text="stat.ticket_count" />
        {{ stat.label }}
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
      statistics: Array()
    }
  },

  computed: {
    layoutTicketCounts(): Object {
      return this.$dashboard?.layout?.ticket_counts ?? []
    },
    statuses(): Array {
      return Object.values(this.$dashboard?.statuses) ?? []
    },
    visibleCounts() {
      return Object.values(this.layoutTicketCounts?.visibleCounts)
    },
    closedStatus(): Object {
      return this.statuses.filter((status) => status.label == 'Closed')[0].id
    },
    resolvedStatus(): Object {
      return this.statuses.filter((status) => status.label == 'Resolved')[0].id
    }
  },

  watch: {
    'tickets.length'() {
      this.buildTicketCountArray()
    }
  },

  created() {
    this.buildTicketCountArray()
  },

  methods: {
    async buildTicketCountArray() {
      let ticketsByStatus = groupBy(this.tickets, 'status')

      this.statistics = {
        all: {
          label: 'All',
          ticket_count: this.tickets?.length
        },
        unresolved: {
          label: 'Unresolved',
          ticket_count: this.tickets?.filter(
            (ticket) => ![this.closedStatus, this.resolvedStatus].includes(ticket.status)
          ).length
        }
      }

      Object.values(this.statuses).forEach((status) => {
        this.statistics[status?.label] = {
          label: status?.label,
          ticket_count: ticketsByStatus[status?.id]?.length ?? 0
        }
      })
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
