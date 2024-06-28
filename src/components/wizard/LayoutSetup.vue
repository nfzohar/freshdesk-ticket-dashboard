<template>
  <div class="flex items-center justify-between w-full my-3 p-2 bg-secondary-600">
    <button
      class="border border-primary-600 rounded-md py-1 px-2 bg-primary-500 hover:bg-primary-600"
      @click="addNewGroup()"
    >
      <i class="fa fa-plus mr-2" />
      <span v-text="`Add new ${layoutVertical ? 'column' : 'row'}`" />
    </button>

    <div class="flex items-center justify-between">
      <button
        v-for="(group, g) in layoutGroups"
        :key="g"
        class="border border-primary-600 rounded-md py-1 px-2 bg-primary-500 hover:bg-primary-600"
        @click="addNewPanel(g)"
      >
        <i class="fa fa-plus mr-2" />
        <span v-text="'Add new panel'" />
      </button>
    </div>
  </div>

  <div
    class="w-full h-full p-2 flex gap-3 rounded-md items-start m-auto"
    :class="`flex-${layoutVertical ? 'row' : 'col'}`"
  >
    <div
      v-for="(group, g) in layoutGroups"
      :key="g"
      class="flex gap-5 rounded-md p-2"
      :class="`flex-${layoutVertical?'col':'row'} ${layoutVertical ? 'w' : 'h'}-96`"
    >
      <a-panel-manager
        v-for="(panel, p) in group"
        :key="p"
        :panel="panel"
        @removePanel="(value) => value"
        @panelUpdated="(value) => (group[g] = value)"
      />

      <button class="block bg-secondary-600" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import APanelManager from '@/components/general/APanelManager.vue'

export default defineComponent({
  name: 'LayoutOrientation',

  components: { APanelManager },

  data() {
    return {
      layoutGroups: []
    }
  },

  computed: {
    layoutVertical(): Boolean {
      return this.$configuration?.orientation == 'vertical'
    },
    currentLayoutGroups(): Array {
      return this.$configuration.theLayout.groups
    },
    textClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    }
  },

  mounted() {
    this.layoutGroups = this.currentLayoutGroups
  },

  methods: {
    addNewGroup() {
      this.layoutGroups.push([])
    },

    addNewPanel(groupdId: Number) {
      this.layoutGroups[groupdId].push({})
    }

    //this.$toast.success('Dashboard configuration was updated.')
  }
})
</script>
