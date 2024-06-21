<template>
  <div
    class="w-full h-max border-primary-600 border rounded-md"
    :class="`bg-secondary-${isSecondaryColorDark ? '600' : '400'}`"
  >
    <div class="flex items-center justify-between py-1 px-2">
      <h1 class="text-xl font-bold mb-1 cursor-pointer" v-text="title" @click="toggleVisibility" />

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

    <div v-if="isOpen" class="w-full h-auto">
      <hr class="mx-1 border border-primary-500" />
      <slot v-if="selectedViewDefault" name="defaultView" />

      <a-statistics-graph
        v-else
        :key="(selectedView, updateToken)"
        :type="selectedView"
        :custom-class="'p-5'"
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

  emits: ['updatedDisplayType', 'toggleVisibility', 'panelUpdated'],

  props: {
    id: {
      type: String,
      required: true
    },
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
    isOpen: {
      type: Boolean,
      required: false,
      default: true
    },
    displayType: {
      type: String,
      required: false,
      default: 'default'
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
    },
    isSecondaryColorDark() {
      return this.$information.isSecondaryColorDark
    }
  },

  watch: {
    selectedView() {
      this.$emit('updatedDisplayType', this.selectedView)
    }
  },

  mounted() {
    this.selectedView = this.displayType
  },

  methods: {
    nextView() {
      let currentIndex = this.views.indexOf(this.selectedView) + 1
      this.selectedView = this.views[currentIndex] ?? 'default'
    },
    toggleVisibility() {
      if (this.isOpen) {
        this.updateToken++
      }
      this.$emit('toggleVisibility', !this.isOpen)
    }
  }
})
</script>

<style scoped>
.graph-icon {
  @apply w-7 h-7 rounded-full border border-primary-500 hover:bg-primary-500 hover:shadow-primary-600;
}
</style>
