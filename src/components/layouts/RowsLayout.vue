<template>
  <div
    class="grid w-full h-screen overflow-y-scroll p-2 scrollbar-hide gap-y-5"
    :class="`grid-cols-1 grid-rows-${rows?.length}`"
  >
    <div
      v-for="(items, r) in rows"
      :key="(r, configChangedToken)"
      class="grid w-full h-auto gap-x-5 p-2"
      :class="`grid-cols-${items.length}`"
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
        @updated-configuration="configChangedToken++"
      />
    </div>
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
      rows: [],
      configChangedToken: 0
    }
  },

  watch: {
    configChangedToken() {
      this.rows = this.$configuration.layoutGroups
    }
  },

  created() {
    this.rows = this.$configuration.layoutGroups
  }
})
</script>
