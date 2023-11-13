<template>
  <div class="flex items-center justify-between w-full">
    <h1 class="text-xl font-bold opacity-40" v-text="'Ticket Statistics'" />

    <default-tooltip>
      <template #trigger>
        <button
          class="font-semibold rounded-md text-base opacity-500 hover:underline"
          :title="'Edit visible statistics'"
          v-text="'Edit'"
        />
      </template>

      <template #body>
        <div class="flex flex-col p-3 bg-secondary-500">
          <h4 class="font-semibold w-full border-b mb-2" v-text="'Manage visible statistics:'" />

          <check-box
            v-for="(stat, sc) in statistics"
            :key="sc"
            :the-value="stat.show"
            :label="stat.label"
            @changed="(value) => (stat.show = value)"
          />
        </div>
      </template>
    </default-tooltip>
  </div>

  <div
    :key="visibleStatistics.length"
    class="flex items-center justify-between w-full rounded-md border border-primary-500 shadow-sm shadow-primary-500 px-10 py-5"
  >
    <span
      v-if="!visibleStatistics.length"
      class="opacity-50"
      v-text="'No statistic data selected.'"
    />

    <div v-for="(stat, s) in visibleStatistics" :key="s" class="flex flex-col text-center p-5">
      <h1 class="text-7xl font-bold" v-text="stat.count" />
      <label class="font-semibold opacity-40" v-text="stat.label" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CheckBox from './CheckBox.vue'
import ApiCall from '@/helpers/APICallHelper'
import DefaultTooltip from './DefaultTooltip.vue'

export default defineComponent({
  name: 'TicketStatisticsSection',

  components: { DefaultTooltip, CheckBox },

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
      return ApiCall.get('tickets/all')
    }
  }
})
</script>
