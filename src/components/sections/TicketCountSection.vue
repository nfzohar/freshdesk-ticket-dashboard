<template>
  <div
    :key="visibleStatistics?.length"
    class="grid gap-5 w-full rounded-md px-10 grid-cols-1 sm:grid-cols-2"
    :class="gridClass"
  >
    <template v-for="(stat, s) in statistics" :key="s">
      <div
        v-if="stat.show"
        class="block rounded-md border border-primary-500 shadow-md shadow-primary-600 bg-primary-500 py-5 w-full text-center font-bold"
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
    visibleStatistics() {
      return this.statistics.filter((stat) => stat.show)
    },
    statuses(): Object {
      return this.$dashboard?.statuses ?? []
    },
    gridClass() {
      let count = this.visibleStatistics?.length

      if (count < 3) {
        return 'sm:grid-cols-2'
      }

      return count == 3
        ? 'md:grid-cols-3'
        : count == 4
        ? 'md:grid-cols-4'
        : 'md:grid-cols-3 lg:grid-cols-5'
    }
  },

  watch: {
    'tickets.length'() {
      this.calculateTicketCounts()
    }
  },

  created() {
    this.statistics.push({
      show: this.$dashboard.layout.ticket_counts.settings['all'],
      label: 'All',
      ticket_count: this.tickets?.length
    })
  },

  mounted() {
    this.calculateTicketCounts()
  },

  methods: {
    calculateTicketCounts() {
      let ticketsByStatus = groupBy(this.tickets, 'status')

      this.statuses?.forEach((choice) => {
        this.statistics.push({
          show: this.$dashboard.statuses[choice.label],
          label: choice.label,
          ticket_count: ticketsByStatus[choice.id]?.length ?? 0
        })
      })
    }
  }
})
</script>
