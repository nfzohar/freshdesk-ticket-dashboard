<template>
  <div
    :key="visibleStatistics?.length"
    class="grid gap-5 w-full rounded-md px-10"
    :class="'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-' + visibleStatistics.length"
  >
    <div
      v-for="(stat, s) in statistics"
      :key="s"
      class="block rounded-md border border-primary-500 shadow-md shadow-primary-600 bg-primary-500 py-5 w-full text-center font-bold"
    >
      <span class="block text-7xl w-full" v-text="stat.ticket_count" />
      {{ stat.label }}
    </div>
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
    statusOptions() {
      return this.$dashboard?.$state?.statuses ?? []
    }
  },

  watch: {
    'tickets.length'() {
      this.calculateTicketCounts()
    }
  },

  mounted() {
    this.calculateTicketCounts()
  },

  methods: {
    calculateTicketCounts() {
      let ticketsByStatus = groupBy(this.tickets, 'status')

      this.statistics.push({
        show: true,
        label: 'All',
        ticket_count: this.tickets?.length
      })

      this.statusOptions?.forEach((option) => {
        this.statistics.push({
          show: true,
          label: option.name,
          ticket_count: ticketsByStatus[option.id].length
        })
      })
    }
  }
})
</script>
