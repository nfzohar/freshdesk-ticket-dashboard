<template>
  <div class="w-full">
    <h1 v-if="title" class="block text-xl font-bold mb-1" v-text="title" />

    <component
      :is="chartType"
      class="w-full p-2 border-primary-700 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
      style="height: 50vh"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script lang="ts">
import {
  Chart,
  Title,
  Legend,
  Tooltip,
  ArcElement,
  BarElement,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
} from 'chart.js'
import {
  Bar as BarChart,
  Line as LineChart,
  Pie as PieChart,
  Doughnut as DoughnutChart
} from 'vue-chartjs'
import { defineComponent } from 'vue'

Chart.register(
  Title,
  Legend,
  Tooltip,
  ArcElement,
  BarElement,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

export default defineComponent({
  name: 'TicketStatisticsGraph',

  components: { BarChart, LineChart, PieChart, DoughnutChart },

  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'bar'
    },
    datasets: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    datasetLabels: {
      type: [Object, Array],
      required: false,
      default: () => []
    },
    mainAxis: {
      type: String,
      required: false,
      default: 'x'
    }
  },

  computed: {
    chartData() {
      return {
        datasets: this.datasets,
        labels: this.datasetLabels
      }
    },

    chartOptions() {
      return {
        responsive: true
      }
    },

    chartType(): String {
      switch (this.type) {
        case 'bar':
          return 'BarChart'
        case 'line':
          return 'LineChart'
        case 'pie':
          return 'PieChart'
        case 'doughnut':
          return 'DoughnutChart'
        default:
          return 'BarChart'
      }
    }
  }
})
</script>
