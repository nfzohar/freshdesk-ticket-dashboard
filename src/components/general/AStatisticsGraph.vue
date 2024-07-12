<template>
  <component
    :key="type"
    :is="chartType"
    :data="chartData"
    :class="customClass"
    :options="chartOptions"
  >
    <span v-text="'Graph could not be loaded.'" />
  </component>
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
    },
    datasetsThroughProp: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    chartData() {
      let chartsData = {
        labels: this.datasetLabels,
        datasets: this.datasets
      }

      if (!this.datasetsThroughProp) {
        chartsData['datasets'] = [
          {
            label: this.datasetTitle ?? 'Info',
            backgroundColor: this.datasetBackground,
            data: this.datasets
          }
        ]
      }
      return chartsData
    },
    chartOptions() {
      return {
        responsive: true,
        indexAxis: this.graphIndexAxis,
        plugins: {
          legend: {
            display: this.showGraphLegend,
            position: this.legendPosition,
            title: 'Tickets'
          }
        }
      }
    },
    legendPosition(): String {
      return this.type == 'line'
        ? 'bottom'
        : this.type == 'pie' || this.type == 'doughnut'
        ? 'left'
        : ''
    },
    graphIndexAxis(): String {
      return this.type == 'h-bar' ? 'y' : 'x'
    },
    showGraphLegend(): Boolean {
      return ['line', 'pie', 'doughnut'].includes(this.type)
    },
    chartType(): String {
      if (this.type == 'pie') return 'PieChart'
      if (this.type == 'line') return 'LineChart'
      if (this.type == 'v-bar') return 'BarChart'
      if (this.type == 'h-bar') return 'BarChart'
      if (this.type == 'doughnut') return 'DoughnutChart'
      return 'BarChart'
    },
    datasetBackground() {
      let colors = []

      for (let i = 0; i < this.datasets?.length; i++) {
        let newColor = Math.floor(Math.random() * 0xfffff * 100000 * 3.14)
        colors[i] = `#${newColor.toString(16).slice(0, 3)}`
      }
      return colors
    }
  }
})
</script>
