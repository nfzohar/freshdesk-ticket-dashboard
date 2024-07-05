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
          :sort-by="panel?.sortBy"
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

  computed: {
    columnsFromState(): Object {
      return this.$configuration?.layoutGroups
    }
  },

  mounted() {
    this.columns = this.columnsFromState
  },

  methods: {
    async updatePanel(newValue: String, panelId: String, property: String) {
      await updatePanelInState(this.columns, newValue, panelId, property)
      this.columns = this.columnsFromState
    }
  }
})
</script>
