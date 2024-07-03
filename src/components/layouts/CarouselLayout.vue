<template>
  <div
    class="grid w-full h-screen overflow-y-scroll p-2 scrollbar-hide gap-y-4"
    :class="`grid-cols-1 grid-rows-${rows?.length}`"
  >
    <template v-for="(items, r) in rows" :key="r">
      <div class="grid w-full h-auto gap-x-5 p-2" :class="`grid-cols-${items?.length}`">
        <component
          v-for="(panel, p) in items"
          :key="p"
          :id="panel.id"
          :tickets="allTickets"
          :is="panel.component"
          :is-open="panel.visible"
          :additional-data="panel.data"
          :display-type="panel.displayType"
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
  name: 'CarouselLayout',

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
    this.rows = this.$configuration?.layoutGroups
  },

  methods: {
    async updatePanel(newValue: String, panelId: String, property: String) {
      await updatePanelInState(this.rows, newValue, panelId, property)
      this.rows = this.rowsFromState
    }
  }
})
</script>
