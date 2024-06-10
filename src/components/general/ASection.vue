<template>
  <details
    class="w-full h-max border-primary-800 border bg-secondary-500 rounded-md shadow-md shadow-primary-600"
    :open="openState"
  >
    <summary class="list-none py-1 px-2">
      <div class="flex items-center justify-between">
        <h1
          class="text-xl font-bold mb-1 cursor-pointer"
          v-text="title"
          @click.stop="$emit('toggleVisibility')"
        />

        <div class="flex items-center gap-x-2">
          <button
            v-if="!selectedViewDefault"
            class="graph-icon"
            :title="'Generate new graph color palette'"
            @click="updateToken++"
          >
            <i class="fa fa-brush" />
          </button>

          <button class="graph-icon" :title="'Switch display type'" @click="nextView()">
            <i class="fa fa-shuffle" />
          </button>
        </div>
      </div>
    </summary>

    <div class="w-full h-auto">
      <hr class="mx-1 border border-primary-500" />

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
  </details>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'ASection',

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
    },
    openState: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    return {
      updateToken: 0,
      isLoading: true,
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

<style scoped>
.graph-icon {
  @apply w-7 h-7 rounded-full border border-primary-500 hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600;
}
</style>
