<template>
  <div ref="scroller" class="w-full h-full overflow-y-auto scrollbar-hide px-1 pb-6">
    <div v-if="editMode" class="sticky top-0 z-30 px-3 pt-3 pb-1">
      <div
        class="card flex flex-wrap items-center justify-between gap-3 px-4 py-3 shadow-lg"
        role="toolbar"
        :aria-label="'Layout editing'"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span
            class="grid place-items-center shrink-0 h-9 w-9 rounded-lg bg-primary/10 text-primary-500"
          >
            <i class="fa fa-pen-ruler" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold" v-text="'Editing layout'" />
            <p
              class="text-xs text-ink-muted"
              v-text="'Drag a panel to move it. Drag its bottom-right corner to resize it.'"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button class="btn-secondary" @click="addPanel">
            <i class="fa fa-plus" />
            <span v-text="'Add panel'" />
          </button>
          <button class="btn-ghost" @click="cancel" v-text="'Cancel'" />
          <button
            class="btn-primary"
            :disabled="!canSave"
            :title="canSave ? '' : 'Add at least one panel first.'"
            @click="save"
          >
            <i class="fa fa-check" />
            <span v-text="'Save layout'" />
          </button>
        </div>
      </div>
    </div>

    <gl-grid-layout
      v-model:layout="items"
      class="dashboard-grid"
      :class="{ 'is-editing': editMode }"
      :col-num="columns"
      :row-height="rowHeight"
      :margin="[gap, gap]"
      :is-draggable="editMode"
      :is-resizable="editMode"
      vertical-compact
      use-css-transforms
    >
      <template #item="{ item }">
        <div class="relative h-full">
          <component
            v-if="panelsById[item.i]?.component"
            :key="panelKey(panelsById[item.i])"
            :is="panelsById[item.i].component"
            :id="panelsById[item.i].id"
            :tickets="allTickets"
            :is-open="panelsById[item.i].visible"
            :sort-by="panelsById[item.i].sortBy"
            :additional-data="panelsById[item.i].data"
            :display-type="panelsById[item.i].displayType"
            @updatedGraphSort="(value: any) => updatePanel(item.i, 'sortBy', value)"
            @toggleVisibility="(value: any) => updatePanel(item.i, 'visible', value)"
            @updatedDisplayType="(value: any) => updatePanel(item.i, 'displayType', value)"
          />
          <div
            v-else
            class="card h-full grid place-items-center text-sm text-ink-muted"
            v-text="'Empty panel'"
          />

          <!-- Covers the panel while editing: the whole panel becomes a drag handle. -->
          <div v-if="editMode" class="edit-chrome">
            <!-- Solid strip over the panel's own header, so its buttons don't compete. -->
            <div class="edit-chrome-header">
              <span class="flex items-center gap-2 min-w-0 text-sm font-semibold">
                <i class="fa fa-grip-vertical text-ink-muted" />
                <span class="truncate" v-text="panelName(panelsById[item.i])" />
              </span>
              <div class="flex shrink-0 gap-1">
                <button
                  class="chrome-button"
                  :title="'Panel settings'"
                  @click="settingsPanelId = String(item.i)"
                >
                  <i class="fa fa-sliders" />
                </button>
                <button
                  class="chrome-button hover:!text-red-500"
                  :title="'Remove panel'"
                  @click="removePanel(String(item.i))"
                >
                  <i class="fa fa-trash-can" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </gl-grid-layout>

    <div
      v-if="editMode && !items.length"
      class="mx-4 mt-2 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-line px-6 py-16 text-center"
    >
      <p class="text-sm text-ink-muted" v-text="'This layout has no panels yet.'" />
      <button class="btn-primary" @click="addPanel">
        <i class="fa fa-plus" />
        <span v-text="'Add panel'" />
      </button>
    </div>

    <panel-settings-dialog
      v-if="settingsPanel"
      :key="settingsPanel.id"
      :panel="settingsPanel"
      @close="closeSettings"
      @remove="removePanel"
      @save="applySettings"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
import { cloneDeep } from 'lodash'
import { GridLayout as GlGridLayout } from 'grid-layout-plus'
import PanelSettingsDialog from '@/components/general/PanelSettingsDialog.vue'
import { panelLabel, updatePanelInState } from '@/helpers/CommonMethods'
import {
  GRID_COLUMNS,
  GRID_GAP,
  GRID_ROW_HEIGHT,
  createPanel,
  panelSize,
  type DashboardPanel
} from '@/helpers/LayoutGrid'

interface GridItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW: number
  minH: number
}

export default defineComponent({
  name: 'GridLayout',

  components: { GlGridLayout, PanelSettingsDialog },

  // Panels fill their grid cell (see APanel).
  provide: { panelFill: true },

  emits: ['exitEdit'],

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    },
    editMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      columns: GRID_COLUMNS,
      rowHeight: GRID_ROW_HEIGHT,
      gap: GRID_GAP,
      // Working copy: edits stay here until saved.
      panels: [] as DashboardPanel[],
      items: [] as GridItem[],
      settingsPanelId: null as string | null
    }
  },

  computed: {
    panelsById(): Record<string, DashboardPanel> {
      return Object.fromEntries(this.panels.map((panel) => [panel.id, panel]))
    },
    settingsPanel(): DashboardPanel | null {
      return this.settingsPanelId ? this.panelsById[this.settingsPanelId] ?? null : null
    },
    canSave(): boolean {
      return this.panels.some((panel) => panel.component)
    }
  },

  watch: {
    // Entering and leaving edit mode both start from the saved layout.
    editMode() {
      this.settingsPanelId = null
      this.loadFromStore()
    }
  },

  created() {
    this.loadFromStore()
  },

  methods: {
    loadFromStore() {
      this.panels = cloneDeep(this.$configuration?.layoutPanels ?? [])
      this.items = this.panels.map((panel) => this.toItem(panel))
    },

    toItem(panel: DashboardPanel): GridItem {
      const { minW, minH } = panelSize(panel.component)
      return { i: panel.id, x: panel.x, y: panel.y, w: panel.w, h: panel.h, minW, minH }
    },

    panelKey(panel: DashboardPanel) {
      return `${panel.id}-${panel.component}-${JSON.stringify(panel.data ?? {})}`
    },

    panelName(panel?: DashboardPanel) {
      if (!panel?.component) return 'New panel'
      return panel.data?.custom_title || panelLabel(panel.component)
    },

    // Display changes made outside edit mode (sort, chart type) are saved right away.
    updatePanel(panelId: string, property: string, value: any) {
      const panel = this.panelsById[panelId]
      if (panel) {
        Object.assign(panel, { [property]: value })
      }
      if (!this.editMode) {
        updatePanelInState(panelId, property, value)
      }
    },

    addPanel() {
      const positioned = this.panels.map((panel) => ({ ...panel, ...this.itemFor(panel.id) }))
      const panel = createPanel('', positioned)

      this.panels.push(panel)
      this.items.push(this.toItem(panel))
      this.settingsPanelId = panel.id

      nextTick(() => {
        const scroller = this.$refs.scroller as HTMLElement | undefined
        scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' })
      })
    },

    itemFor(panelId: string) {
      const item = this.items.find((item) => item.i == panelId)
      return item ? { x: item.x, y: item.y, w: item.w, h: item.h } : {}
    },

    applySettings(changes: { component: string; data: Record<string, any> }) {
      const panel = this.settingsPanel
      if (!panel) return

      const wasEmpty = !panel.component
      Object.assign(panel, changes)

      // A newly chosen panel type gets that type's default size.
      const item = this.items.find((item) => item.i == panel.id)
      if (item) {
        const size = panelSize(panel.component)
        Object.assign(item, { minW: size.minW, minH: size.minH })
        if (wasEmpty) {
          Object.assign(item, { w: size.w, h: size.h })
        }
      }
      this.settingsPanelId = null
    },

    closeSettings() {
      // Closing "Add panel" without choosing a type discards the new panel.
      if (this.settingsPanel && !this.settingsPanel.component) {
        this.removePanel(this.settingsPanel.id)
      }
      this.settingsPanelId = null
    },

    removePanel(panelId: string) {
      this.panels = this.panels.filter((panel) => panel.id != panelId)
      this.items = this.items.filter((item) => item.i != panelId)
      this.settingsPanelId = null
    },

    cancel() {
      this.$emit('exitEdit')
    },

    save() {
      const panels = this.panels
        .filter((panel) => panel.component)
        .map((panel) => ({ ...panel, ...this.itemFor(panel.id) }))

      this.$configuration.updateLayoutPanels(cloneDeep(panels))
      this.$toast.success('Layout saved.')
      this.$emit('exitEdit')
    }
  }
})
</script>

<style scoped>
.edit-chrome {
  @apply absolute inset-0 z-10 rounded-xl cursor-move bg-canvas/30 outline-dashed outline-2 outline-primary/60 transition-colors hover:bg-primary/5;
}

.edit-chrome-header {
  @apply flex h-12 items-center justify-between gap-2 rounded-t-xl border-b border-line bg-surface pl-4 pr-2;
}

.chrome-button {
  @apply grid place-items-center h-8 w-8 rounded-lg border border-line bg-surface text-sm text-ink-muted shadow-sm transition-colors hover:text-ink;
}
</style>
