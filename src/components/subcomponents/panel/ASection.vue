<template>
  <div class="w-full">
    <a-section-title
      :the-text="title"
      :section-visible="showSection"
      :show-recolor-button="selectedView != 'default'"
      @toggleVisibility="showSection = !showSection"
      @recolorGraph="updateToken++"
      @switchView="nextView()"
    />

    <div
      v-if="showSection"
      class="border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
    >
      <slot v-if="selectedViewDefault" name="defaultView" />

      <a-statistics-graph
        v-else
        :key="(selectedView, updateToken)"
        :type="selectedView"
        :custom-class="'p-5 border-primary-700 border'"
        :datasets="datasets"
        :dataset-title="title"
        :dataset-labels="datasetLabels"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASectionTitle from '@/components//General/ASectionTitle.vue'
import AStatisticsGraph from '@/components/General/AStatisticsGraph.vue'

export default defineComponent({
  name: 'ASection',

  components: { AStatisticsGraph, ASectionTitle },

  props: {
    title: {
      type: String,
      required: true,
      default: 'Custom Section'
    },
    datasets: {
      type: [Array, Object],
      required: false,
      default: () => []
    },
    datasetLabels: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      updateToken: 0,
      isLoading: true,
      showSection: true,
      selectedView: 'default',
      views: ['default', 'v-bar', 'h-bar', 'pie', 'doughnut']
    }
  },

  computed: {
    selectedViewDefault() {
      return this.selectedView == 'default'
    }
  },

  methods: {
    nextView() {
      let currentIndex = this.views.indexOf(this.selectedView) + 1
      this.selectedView = this.views[currentIndex] ?? 'default'
    }
  }
})
</script>
