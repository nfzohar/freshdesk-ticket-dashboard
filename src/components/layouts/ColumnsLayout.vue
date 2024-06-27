<template>
  <div
    class="grid w-screen h-screen px-5 overflow-y-scroll scrollbar-hide gap-x-4"
    :class="`grid-cols-1 grid-cols-${columns?.length}`"
  >
    <template v-for="(items, r) in columns" :key="r">
      <div class="grid w-full h-min gap-y-5" :class="`grid-rows-${items?.length}`">
        <component
          v-for="(panel, p) in items"
          :key="p"
          :id="panel.id"
          :tickets="allTickets"
          :is="panel.component"
          :is-open="panel.visible"
          :additional-data="panel.data"
          :display-type="panel.displayType"
          @toggleVisibility="(value) => updatePanelState(value, panel?.id, 'visible')"
          @updatedDisplayType="(value) => updatePanelState(value, panel?.id, 'displayType')"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ColumnsLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return { columns: [] }
  },

  mounted() {
    this.columns = this.$configuration.layoutGroups
  },

  methods: {
    updatePanelState(newValue: String, panelId: String, property: String) {
      this.columns.forEach((row) => {
        row.forEach((panel) => {
          if (panel.id == panelId) {
            panel[property] = newValue
          }
        })
      })

      this.$configuration.updateLayoutGroups(this.columns)
    }
  }
})
</script>
