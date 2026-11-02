<template>
  <section
    class="card w-full overflow-hidden"
    :class="panelFill ? 'h-full flex flex-col' : 'h-min'"
  >
    <header class="flex shrink-0 items-center justify-between gap-2 py-2 pl-4 pr-2">
      <!-- In the grid, panel height is set by resizing, so collapsing is turned off. -->
      <h2
        v-if="panelFill"
        class="truncate text-sm font-semibold capitalize"
        :title="title"
        v-text="title"
      />
      <button
        v-else
        class="flex items-center gap-2 min-w-0 text-left"
        :title="isOpen ? 'Collapse panel' : 'Expand panel'"
        :aria-expanded="isOpen"
        @click="toggleVisibility"
      >
        <i
          class="fa fa-chevron-down text-xs text-ink-muted transition-transform"
          :class="{ '-rotate-90': !isOpen }"
        />
        <h2 class="truncate text-sm font-semibold capitalize" v-text="title" />
      </button>

      <div v-if="showViewSwitch" class="flex items-center gap-0.5">
        <template v-if="!selectedViewDefault">
          <button
            v-if="hasColorPalette"
            class="actions-button h-8 w-8 text-sm"
            :title="'Generate new graph color palette'"
            @click="updateToken++"
          >
            <i class="fa fa-palette" />
          </button>

          <button
            v-if="isSortable"
            class="actions-button h-8 w-8 text-sm"
            :title="sortTitle"
            :key="selectedSortBy"
            @click="setSort()"
          >
            <i :class="`fa ${sortIcon}`" />
          </button>
        </template>

        <button
          class="actions-button h-8 w-8 text-sm"
          :title="'Switch display type'"
          @click="nextView()"
        >
          <i class="fa fa-shuffle" />
        </button>
      </div>
    </header>

    <div
      v-if="isOpen || panelFill"
      class="w-full border-t border-line"
      :class="panelFill ? 'flex-1 min-h-0 overflow-y-auto scrollbar-hide' : 'h-auto'"
    >
      <slot v-if="selectedViewDefault" name="defaultView" />

      <div v-else :class="panelFill ? 'relative h-full p-4' : 'p-4'">
        <a-statistics-graph
          :key="(selectedView, selectedSortBy, updateToken)"
          :type="selectedView"
          :custom-class="''"
          :fill="panelFill"
          :dataset-title="title"
          :datasets="dataset?.values"
          :dataset-labels="dataset?.labels"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { generateGraphDataset, ROUND_CHART_TYPES } from '@/helpers/CommonMethods'
import AStatisticsGraph from '@/components/general/AStatisticsGraph.vue'

export default defineComponent({
  name: 'APanel',

  components: { AStatisticsGraph },

  // Provided by the grid layout: the panel fills its grid cell instead of sizing to content.
  inject: { panelFill: { default: false } },

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
    // Bar/line views are now a single brand-colored series with no palette to
    // regenerate; only part-to-whole views have per-segment colors to shuffle.
    hasColorPalette() {
      return ROUND_CHART_TYPES.includes(this.selectedView)
    },
    accentSecondaryBg(): string {
      return this.$information?.bgAccentSecondaryColor
    },
    panelBorder(): string {
      return this.$information?.conditionalPrimaryBorder
    },
    dataset(): any {
      return this.isSortable
        ? generateGraphDataset(this.datasetSource, this.sortBy)
        : this.datasetSource
    },
    sortIcon(): string {
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
