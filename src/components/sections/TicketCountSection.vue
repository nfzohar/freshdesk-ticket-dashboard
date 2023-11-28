<template>
  <div
    :key="visibleStatistics?.length"
    class="gap-5 w-full rounded-md px-10 items-center justify-between"
    :class="[
      visibleStatistics.length > 10
        ? 'flex items-center justify-between'
        : 'grid grid-cols-1 sm:grid-cols-2 ' + getConditionalGridStyle()
    ]"
  >
    <template v-for="(stat, s) in statistics" :key="s">
      <div
        v-if="layout.ticket_counts.settings[stat.label]"
        class="block mb-3 md:mb-0 rounded-md border border-primary-500 shadow-md shadow-primary-600 bg-primary-500 hover:bg-primary-600 py-5 w-full text-center font-bold"
      >
        <span class="block text-7xl w-full" v-text="stat.ticket_count" />
        {{ stat.label }}
      </div>
    </template>
  </div>
  <span v-if="!visibleStatistics.length" v-text="'No statistic data selected.'" />
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
    layout(): Object {
      return this.$dashboard?.layout ?? []
    },
    statuses(): Object {
      return Object.values(this.$dashboard?.statuses) ?? []
    },
    visibleStatistics() {
      return Object.values(this.layout.ticket_counts.settings).filter((stat) => stat)
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
          label: status.label,
          ticket_count: ticketsByStatus[status.id]?.length ?? 0
        }
      })
    },

    getConditionalGridStyle() {
      let count = Number(this.visibleStatistics?.length)

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
