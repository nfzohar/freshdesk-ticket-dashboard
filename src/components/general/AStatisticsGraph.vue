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
import { theme } from '@/helpers/Theme'
import { ROUND_CHART_TYPES } from '@/helpers/CommonMethods'

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
      default: 'w-full m-auto p-2'
    },
    // Stretch to the parent's size instead of keeping the chart's aspect ratio.
    fill: {
      type: Boolean,
      required: false,
      default: false
    },
    datasetsThroughProp: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      theme,
      // Random start hue for segments after the first (always primary); the
      // panel's palette button re-rolls this for a new look on round charts.
      paletteSeed: Math.random() * 360
    }
  },

  computed: {
    // Read from the theme tokens, so charts follow light/dark mode.
    themeColors() {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.theme.dark
      const style = getComputedStyle(document.documentElement)
      const token = (name: string) => `rgb(${style.getPropertyValue(name).trim()})`
      const tokenAlpha = (name: string, alpha: number) =>
        `rgb(${style.getPropertyValue(name).trim()} / ${alpha})`

      return {
        text: token('--ink-muted'),
        grid: tokenAlpha('--line', 0.8),
        line: token('--ink'),
        surface: token('--surface'),
        primary: token('--primary')
      }
    },
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
            borderColor: this.graphBorderColor,
            data: this.datasets
          }
        ]
      }
      return chartsData
    },
    chartOptions() {
      const colors = this.themeColors
      const axis = {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
        border: { color: colors.grid }
      }
      const radialAxis = {
        ticks: { color: colors.text, backdropColor: 'transparent' },
        grid: { color: colors.grid },
        angleLines: { color: colors.grid },
        pointLabels: { color: colors.text }
      }
      const isRound = this.isRound

      return {
        responsive: true,
        maintainAspectRatio: !this.fill,
        tension: this.graphTension,
        indexAxis: this.graphIndexAxis,
        borderColor: colors.surface,
        elements: { bar: { borderRadius: 6 } },
        scales: this.type == 'polar-area' ? { r: radialAxis } : isRound ? {} : { x: axis, y: axis },
        plugins: {
          legend: {
            display: this.showGraphLegend,
            position: this.legendPosition,
            title: 'Tickets',
            labels: { color: colors.text, usePointStyle: true }
          }
        }
      }
    },
    legendPosition(): String {
      if (['bezier-line', 'line'].includes(this.type)) return 'bottom'
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
      return (
        this.displayGraphLegend ||
        ['bezier-line', 'line', 'pie', 'doughnut', 'polar-area'].includes(this.type)
      )
    },
    graphBorderColor(): Any {
      return ['line', 'bezier-line'].includes(this.type) ? this.themeColors.line : 'transparent'
    },
    // Part-to-whole charts need one color per segment; bar/line charts are a
    // single series across categories, so magnitude (bar length) carries the data.
    isRound(): Boolean {
      return ROUND_CHART_TYPES.includes(this.type)
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
      // Bar/line charts are a single series across categories: every bar is the
      // brand primary color, so magnitude (length), not hue, carries the data.
      if (!this.isRound) {
        return this.themeColors.primary
      }

      // Pie/doughnut/polar-area need a color per segment to stay legible. The
      // first segment is always the brand primary; the rest spread via golden-
      // angle hue rotation, with fixed saturation/lightness so every colour reads
      // on both themes. The panel's palette button re-rolls the seed for variety.
      const lightness = this.theme.dark ? 62 : 52
      let colors = [this.themeColors.primary]

      for (let i = 1; i < this.datasets?.length; i++) {
        const hue = (this.paletteSeed + i * 137.508) % 360
        colors[i] = `hsl(${hue.toFixed(0)} 65% ${lightness}%)`
      }
      return colors
    }
  }
})
</script>
