<template>
  <div class="grid grid-cols-1 w-screen h-screen p-3 gap-x-4">
    <div class="flex flex-col gap-10 w-full overflow-y-scroll scrollbar-hide">
      <div v-for="(panel, p) in panels" :key="p" class="px-2 py-1">
        <component
          :id="panel.id"
          :tickets="allTickets"
          :is="panel.component"
          :is-open="panel.visible"
          :sort-by="panel?.sortBy"
          :additional-data="panel.data"
          :display-type="panel.displayType"
          @updatedGraphSort="(value) => updatePanel(value, panel?.id, 'sortBy')"
          @toggleVisibility="(value) => updatePanel(value, panel?.id, 'visible')"
          @updatedDisplayType="(value) => updatePanel(value, panel?.id, 'displayType')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { updatePanelInState } from '@/helpers/CommonMethods'
import { panelsInReadingOrder } from '@/helpers/LayoutGrid'

export default defineComponent({
  name: 'MobileLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return { panels: [] as any[] }
  },

  mounted() {
    // Panels stack in the grid's reading order.
    this.panels = panelsInReadingOrder(this.$configuration?.layoutPanels)
  },

  methods: {
    updatePanel(newValue: any, panelId: string, property: string) {
      updatePanelInState(panelId, property, newValue)
    }
  }
})
</script>
