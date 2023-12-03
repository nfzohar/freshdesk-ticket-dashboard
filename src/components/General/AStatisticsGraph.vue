<template>
  <div :key="type" class="w-full">
    <h1 v-if="title" class="block text-xl font-bold mb-1" v-text="title" />

    <component
      :is="chartType"
      :class="customClass"
      style="max-height: 50vh"
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
        'w-full p-2 border-primary-700 border bg-secondary-500 rounded-md shadow-md shadow-primary-600'
    }
  },

  computed: {
    chartData() {
      return {
        labels: this.datasetLabels,
        datasets: [
          {
            label: 'Info',
            backgroundColor: this.datasetBackground,
            data: this.datasets
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        indexAxis: this.type == 'h-bar' ? 'y' : 'x',
        elements: {
          arc: {
            borderwidth: 5,
            bordercolor: 'none'
          }
        }
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
