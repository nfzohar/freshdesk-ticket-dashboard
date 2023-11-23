<template>
  <div class="w-full">
    <h1 class="text-xl font-bold mb-1" v-text="'Ticket Statistics'" />

    <Bar
      class="w-full p-2 border-primary-700 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      :class="'overflow-y-scroll scrollbar-hide'"
      style="max-height: 50vh"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import { defineComponent } from 'vue'
// import { groupBy, uniqBy } from 'lodash'

export default defineComponent({
  name: 'TicketStatisticsChart',

  components: { Bar },

  props: {
    tickets: {
      type: [Object, Array],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      chartData: {
        title: 'test',
        datasets: [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }],
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
})
</script>
