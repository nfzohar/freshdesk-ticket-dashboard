<template>
  <div :class="`w-full h-min rounded-md ${accentSecondaryBg} ${panelBorder}`">
    <div class="flex items-center justify-between py-1 px-2">
      <h1
        class="text-xl font-bold mb-1 capitalize cursor-pointer"
        v-text="title"
        @click="toggleVisibility"
      />

      <div v-if="showViewSwitch" class="flex items-center gap-x-2">
        <template v-if="!selectedViewDefault">
          <button
            class="graph-icon transition-transform hover:rotate-45"
            :title="'Generate new graph color palette'"
            @click="updateToken++"
          >
            <i class="fa fa-brush" />
          </button>

          <button
            v-if="isSortable"
            class="graph-icon transition-transform"
            :title="sortTitle"
            :key="selectedSortBy"
            @click="setSort()"
          >
            <i :class="`fa ${sortIcon}`" />
          </button>
        </template>

        <button class="graph-icon" :title="'Switch display type'" @click="nextView()">
          <i class="fa fa-shuffle" />
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="w-full h-auto p-1">
      <hr class="mx-1 border border-primary-500" />
      <slot v-if="selectedViewDefault" name="defaultView" />

      <a-statistics-graph
        v-else
        :key="(selectedView, selectedSortBy, updateToken)"
        :type="selectedView"
        :custom-class="'p-5'"
        :dataset-title="title"
        :datasets="dataset?.values"
        :dataset-labels="dataset?.labels"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { generateGraphDataset } from '@/helpers/CommonMethods'
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'APanel',

  components: { AStatisticsGraph },

  emits: ['updatedDisplayType', 'updatedGraphSort', 'toggleVisibility', 'panelUpdated'],

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
    datasetSource: {
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
    },
    sortBy: {
      type: String,
      required: false,
      default: 'name-asc'
    },
    isSortable: {
      type: Boolean,
      required: false,
      default: true
    },
    showViewSwitch: {
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
      selectedSortBy: 'names-asc',
      sorts: ['name-asc', 'name-desc', 'ticket_count-asc', 'ticket_count-desc']
    }
  },

  computed: {
    selectedViewDefault() {
      return this.selectedView == 'default'
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    },
    panelBorder(): String {
      return this.$information?.conditionalPrimaryBorder
    },
    dataset(): Object {
      return this.isSortable
        ? generateGraphDataset(this.datasetSource, this.sortBy)
        : this.datasetSource
    },
    sortIcon(): String {
      if (this.selectedSortBy == this.sorts[0]) return 'fa-arrow-up-a-z'
      if (this.selectedSortBy == this.sorts[1]) return 'fa-arrow-down-a-z'
      if (this.selectedSortBy == this.sorts[2]) return 'fa-arrow-up-1-9'
      if (this.selectedSortBy == this.sorts[3]) return 'fa-arrow-down-1-9'
      return 'fa-arrow-up-short-wide'
    },
    sortTitle() {
      if (this.selectedSortBy == this.sorts[0]) return 'Sorted alphabeticaly, ascending.'
      if (this.selectedSortBy == this.sorts[1]) return 'Sorted alphabeticaly, descending.'
      if (this.selectedSortBy == this.sorts[2]) return 'Sorted by ticket count, ascending.'
      if (this.selectedSortBy == this.sorts[3]) return 'Sorted by ticket count, descending.'
      return 'Set graph sorting'
    },
    views() {
      let arrayTypesFromStore = this.$information?.graphTypes.map((type) => type?.value)
      return ['default'].concat(arrayTypesFromStore)
    }
  },

  watch: {
    selectedView() {
      this.$emit('updatedDisplayType', this.selectedView)
    },
    selectedSortBy() {
      this.$emit('updatedGraphSort', this.selectedSortBy)
    }
  },

  mounted() {
    this.selectedSortBy = this.sortBy
    this.selectedView = this.displayType
  },

  methods: {
    nextView() {
      let currentViewIndex = this.views.indexOf(this.selectedView)
      this.selectedView = this.views[currentViewIndex + 1] ?? 'default'
    },

    setSort() {
      let currentSortIndex = this.sorts.indexOf(this.selectedSortBy)
      this.selectedSortBy = this.sorts[currentSortIndex + 1] ?? 'name-asc'
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
  @apply w-7 h-7 rounded-full border border-primary-500 hover:bg-primary-500;
}
</style>
