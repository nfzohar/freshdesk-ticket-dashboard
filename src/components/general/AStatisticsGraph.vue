<template>
  <component
    :key="type"
    :is="chartType"
    :class="customClass"
    :data="chartData"
    :options="chartOptions"
  />
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
    datasetTitle: {
      type: String,
      required: false,
      default: null
    },
    type: {
      type: String,
      required: false,
      default: 'v-bar'
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
    customClass: {
      type: String,
      required: false,
      default:
        'w-full m-auto p-2 border-primary-700 border bg-secondary-500 rounded-md shadow-primary-600'
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.datasetLabels,
        datasets: [
          {
            label: this.datasetTitle ?? 'Info',
            backgroundColor: this.datasetBackground,
            data: this.datasets
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        indexAxis: this.type == 'h-bar' ? 'y' : 'x'
      }
    },
    chartType(): String {
      switch (this.type) {
        case 'v-bar':
          return 'BarChart'
        case 'h-bar':
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
    },
    datasetBackground() {
      let colors = []

      for (let i = 0; i < this.datasets?.length; i++) {
        colors.push(
          '#' +
            Math.floor(Math.random() * 0xfffff * 1000000)
              .toString(16)
              .slice(0, 3)
        )
      }

      return colors
    }
  }
})
</script>
