<template>
  <div
    :key="visibleStatistics?.length"
    class="grid grid-cols-2 md:flex items-center flex-col md:flex-row gap-2 justify-between w-full rounded-md px-10"
  >
    <div
      v-for="(stat, s) in visibleStatistics"
      :key="s"
      class="rounded-md border border-primary-500 shadow-md shadow-primary-600 bg-primary-500 px-10 py-5 w-full md:w-2/12 text-center"
    >
      <h1 class="text-7xl font-bold w-full" v-text="stat.count" />
      <label class="font-bold opacity-50 w-full" v-text="stat.label" />
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
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'TicketStatisticsSection',

  data() {
    return {
      tickets: [],
      statistics: [
        {
          show: true,
          label: 'All',
          count: 0
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
    getTicketCounts() {
    }
  }
})
</script>
