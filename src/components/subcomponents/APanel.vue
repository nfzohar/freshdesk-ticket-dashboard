<template>
  <div class="w-full">
    <!-- <a-section-title
      :the-text="title"
      :section-visible="showSection"
      :show-recolor-button="selectedView != 'default'"
      @toggleVisibility="showSection = !showSection"
      @recolorGraph="updateToken++"
      @switchView="nextView()"
    /> -->

    <div class="flex items-center justify-between">
      <h1
        class="text-xl font-bold mb-1 cursor-pointer"
        :class="{
          'border-l-4 border-primary-400 bg-secondary-600 pr-2 pl-1 rounded-r-md': !sectionVisible
        }"
        v-text="theText"
        @click.stop="$emit('toggleVisibility')"
      />

      <div v-if="sectionVisible" class="flex items-center gap-x-2">
        <button
          v-if="showRecolorButton"
          class="hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600 p-1 w-6 h-6 rounded-full"
          :title="'Generate new graph color palette'"
          @click="$emit('recolorGraph')"
        >
          <!-- <brush-icon pt-width="12pt" pt-height="12pt" /> -->
        </button>
        <button
          v-if="showSwitchButton"
          class="hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600 w-6 h-6 rounded-full"
          :title="'Switch display type'"
          @click="$emit('switchView')"
        >
          <!-- <switch-icon pt-width="18pt" pt-height="18pt" /> -->
        </button>
      </div>
    </div>

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
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'APanel',

  components: { AStatisticsGraph },

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
