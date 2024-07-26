<template>
  <div class="flex flex-col w-100p h-100vh p-3 gap-5 overflow-y-scroll scrollbar-hide">
    <template v-for="(items, r) in rows" :key="r">
      <div :class="`grid h-min w-full xl:w-95p gap-5 m-auto ${panelGridlass(items?.length)}`">
        <component
          v-for="(panel, p) in items"
          :key="p"
          :id="panel.id"
          :tickets="allTickets"
          :is="panel.component"
          :is-open="panel.visible"
          :sort-by="panel?.sortBy"
          :panel-sort="panel?.sortBy"
          :additional-data="panel.data"
          :display-type="panel.displayType"
          @updatedGraphSort="(value) => updatePanel(value, panel?.id, 'sortBy')"
          @toggleVisibility="(value) => updatePanel(value, panel?.id, 'visible')"
          @updatedDisplayType="(value) => updatePanel(value, panel?.id, 'displayType')"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { updatePanelInState } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'RowsLayout',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return { rows: [] }
  },

  computed: {
    rowsFromState(): Object {
      return this.$configuration?.layoutGroups
    }
  },

  mounted() {
    this.rows = this.rowsFromState
  },

  methods: {
    async updatePanel(newValue: String, panelId: String, property: String) {
      await updatePanelInState(this.rows, newValue, panelId, property)
      this.rows = this.rowsFromState
    },

    panelGridlass(panelLength: number) {
      if (panelLength == 4) return 'grid-cols-4'
      return `grid-cols-${panelLength}`
    }
  }
})
</script>
