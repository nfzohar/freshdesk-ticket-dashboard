<template>
  <div class="block w-screen h-screen p-10 scrollbar-hide">
    <ACarousel></ACarousel>
    <template v-for="(items, r) in rows" :key="r">
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
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ACarousel from '@/components/general/ACarousel'
import { updatePanelInState } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'SpinLayout',

  components: { ACarousel },

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    }
  },

  data() {
    return { index: 0, rows: [] }
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
