<template>
  <div
    :class="`grid gap-3 w-full p-2 rounded-md items-start m-auto ${groupGridConfig}`"
    style="height: 65vh"
  >
    <div
      v-for="(group, g) in layoutGroups"
      :key="g"
      :class="`grid gap-5 items-center rounded-md p-2 ${panelGridConfig}`"
    >
      <a-panel-manager
        v-for="(panel, p) in group"
        :key="p"
        :panel="panel"
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
      <span
        class="opacity-40 text-2xl font-bold"
        v-text="`Add a new ${layoutIsCols ? 'column' : 'row'}`"
      />
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
    currentLayoutGroups(): Array {
      return this.$configuration.theLayout.groups
    },
    textClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    },
    layoutIsCols(): Boolean {
      return this.$configuration?.orientation == 'vertical'
    },
    groupGridConfig() {
      return `auto-${this.layoutIsCols ? 'cols' : 'rows'}-auto grid-flow-${
        this.layoutIsCols ? 'col' : 'row'
      }`
    },
    panelGridConfig() {
      return `auto-${this.layoutIsCols ? 'rows' : 'cols'}-auto grid-flow-${
        this.layoutIsCols ? 'row' : 'col'
      }`
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
        id: `${groupId}-${this.layoutGroups[groupId]?.length}`,
        displayType: 'default',
        component: '',
        visible: true,
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
