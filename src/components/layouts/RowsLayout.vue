<template>
  <div
    class="grid w-full h-screen overflow-y-scroll p-2 scrollbar-hide gap-y-5"
    :class="`grid-cols-1 grid-rows-${rows?.length}`"
  >
    <template v-for="(items, r) in rows" :key="r">
      <div
        class="grid w-full h-auto gap-x-5 p-2"
        :class="items?.length ? `grid-cols-${items.length}` : 'hidden'"
      >
        <component
          v-for="(panel, p) in items"
          :key="p"
          :id="panel.id"
          :tickets="allTickets"
          :is="panel.component"
          :is-open="panel.visible"
          :additional-data="panel.data"
          :display-type="panel.displayType"
          @updated-configuration="(value) => updatePanelDisplayType(value, panel?.id)"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RowsLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return {
      rows: []
    }
  },

  created() {
    this.rows = this.$configuration.layoutGroups
  },

  methods: {
    updatePanelDisplayType(newDisplayType: String, panelId: Number) {
      this.rows.forEach((row) => {
        row.forEach((panel) => {
          if (panel.id == panelId) {
            panel.displayType = newDisplayType
          }
        })
      })

      this.$configuration.layout.groups = this.rows
    }
  }
})
</script>
