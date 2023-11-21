<template>
  <div
    :key="visibleStatistics?.length"
    class="grid grid-cols-2 md:flex items-center flex-col md:flex-row gap-2 justify-between w-full rounded-md px-10"
    style="max-height: 40%"
  >
    <div
      v-for="(stat, s) in visibleStatistics"
      :key="s"
      class="block rounded-md border border-primary-500 shadow-md shadow-primary-600 bg-primary-500 px-10 py-5 w-full md:w-2/12"
    >
      <h1 class="block text-7xl font-bold w-full text-center" v-text="stat.count" />
      <label class="block font-bold opacity-50 w-full text-center" v-text="stat.label" />
    </div>
  </div>
  <span
    v-if="!visibleStatistics.length"
    class="opacity-50"
    v-text="'No statistic data selected.'"
  />
</template>

<script lang="ts">
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
      statistics: [
        {
          show: true,
          label: 'All',
          count: this.tickets.length
        },
        {
          show: true,
          label: 'Open',
          count: 0
        },
        {
          show: false,
          label: 'Resolved',
          count: 0
        },
        {
          show: true,
          label: 'Closed',
          count: 0
        },
        {
          show: false,
          label: 'Unassigned',
          count: 0
        }
      ]
    }
  },

  computed: {
    visibleStatistics() {
      return this.statistics.filter((stat) => stat.show)
    }
  },

  mounted() {
    this.getTicketCounts()
  },

  methods: {
    getTicketCounts() {}
  }
})
</script>
