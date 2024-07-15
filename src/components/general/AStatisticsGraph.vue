<template>
  <component
    :key="type"
    :is="chartType"
    :data="chartData"
    :class="customClass"
    :options="chartOptions"
  >
    <span class="block opacity-50 px-5" v-text="'Graph could not be loaded.'" />
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
  CategoryScale,
  RadialLinearScale
} from 'chart.js'
import {
  Bar as BarChart,
  Line as LineChart,
  Pie as PieChart,
  Doughnut as DoughnutChart,
  PolarArea as PolarAreaChart
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
  CategoryScale,
  RadialLinearScale
)

export default defineComponent({
  name: 'TicketStatisticsGraph',

  components: { BarChart, LineChart, PieChart, DoughnutChart, PolarAreaChart },

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
    displayGraphLegend: {
      type: Boolean,
      required: false,
      default: false
    },
    customClass: {
      type: String,
      required: false,
      default: 'w-full m-auto p-2 border-primary-700 border bg-secondary-500 rounded-md'
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
        maintainAspectRatio: true,
        tension: this.graphTension,
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
      if (this.type == 'line') return 'bottom'
      if (['pie', 'doughnut', 'polar-area'].includes(this.type)) return 'left'
      return 'top'
    },
    graphIndexAxis(): String {
      return this.type == 'h-bar' ? 'y' : 'x'
    },
    graphTension() {
      return this.type == 'bezier-line' ? 0.5 : 0
    },
    showGraphLegend(): Boolean {
      return this.displayGraphLegend || ['line', 'pie', 'doughnut'].includes(this.type)
    },
    chartType(): String {
      if (this.type == 'pie') return 'PieChart'
      if (this.type == 'v-bar') return 'BarChart'
      if (this.type == 'h-bar') return 'BarChart'
      if (this.type == 'line') return 'LineChart'
      if (this.type == 'bezier-line') return 'LineChart'
      if (this.type == 'doughnut') return 'DoughnutChart'
      if (this.type == 'polar-area') return 'PolarAreaChart'
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
