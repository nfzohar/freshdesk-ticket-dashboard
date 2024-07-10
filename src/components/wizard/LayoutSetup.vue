<template>
  <div
    :class="`grid gap-3 w-full h-60vh p-3 rounded-md items-start m-auto ${groupGridConfig}`">
    <div
      v-for="(group, g) in layoutGroups"
      :key="g"
      :class="`grid gap-5 items-center rounded-md p-2 ${panelGridConfig}`"
    >
      <a-panel-manager
        v-for="(panel, p) in group"
        :key="p"
        :panel="panel"
        :visible-id="`${g}-${p}`"
        @panelUpdated="(value) => updateLayoutGroups(g, p, value)"
        @removePanel="(value) => removePanelFromGroup(value, g)"
      />

      <button
        :key="group?.length"
        class="block w-full h-full rounded-md p-2 bg-secondary-600"
        :class="{
          'hover:bg-secondary-500 hover:border hover:border-primary-500': !groupIncludesComponent(g)
        }"
        :disabled="groupIncludesComponent(g)"
        @click="addNewPanel(g)"
      >
        <span class="opacity-40 text-2xl font-bold" v-text="'Add a new panel'" />
      </button>
    </div>

    <button
      class="block w-full h-full rounded-md p-2 bg-secondary-600 hover:bg-secondary-500 hover:border hover:border-primary-500"
      @click="addNewGroup()"
    >
      <span class="opacity-40 text-2xl font-bold" v-text="'Add a new panel group'" />
    </button>
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
    layout(): String {
      return this.$configuration?.layoutComponent
    },
    currentLayoutGroups(): Array {
      return this.$configuration.theLayout.groups
    },
    textClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    },
    groupGridConfig() {
      if (this.layout == 'spin-layout') return 'grid-cols-1'
      if (this.layout == 'rows-layout') return 'auto-rows-auto grid-flow-row'
      if (this.layout == 'columns-layout') return 'auto-cols-auto grid-flow-col'
      return ''
    },
    panelGridConfig() {
      if (this.layout == 'spin-layout') return 'grid-cols-5'
      if (this.layout == 'rows-layout') return 'auto-cols-auto grid-flow-col'
      if (this.layout == 'columns-layout') return 'auto-cols-auto grid-flow-row'
      return ''
    }
  },

  mounted() {
    this.layoutGroups = this.currentLayoutGroups
  },

  methods: {
    addNewGroup() {
      this.layoutGroups.push([])
      this.addNewPanel(this.layoutGroups.length - 1)
    },

    addNewPanel(groupId: Number) {
      let newComponent = {
        id: String(Math.random()),
        displayType: 'default',
        component: '',
        visible: true,
        sortBy: {},
        data: {}
      }
      this.layoutGroups[groupId].push(newComponent)
    },

    updateLayoutGroups(groupId: number, panelId: number, panelNewValue: Object) {
      this.layoutGroups[groupId][panelId] = panelNewValue
      this.$configuration?.updateLayoutGroups(this.layoutGroups)
    },

    removePanelFromGroup(componentId: String, groupId: number) {
      this.layoutGroups[groupId] = this.layoutGroups[groupId]?.filter(
        (component) => component?.id != componentId
      )

      if (!this.layoutGroups[groupId]?.length) {
        this.layoutGroups.splice(groupId, 1)
      }
      this.$configuration?.updateLayoutGroups(this.layoutGroups)
    },

    groupIncludesComponent(groupId: number, component: String = 'TicketCounters') {
      let componentInGroup = this.layoutGroups[groupId].map((group) => group.component)
      return componentInGroup.includes(component)
    }
  }
})
</script>
