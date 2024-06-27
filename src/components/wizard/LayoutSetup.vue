<template>
    <div 
      class="w-max h-full p-2 flex gap-3 rounded-md items-start m-auto"
      :class="`flex-${layoutVertical ? 'row' : 'col'}`"
    >
      <div v-for="(group, g) in layoutGroups" :key="g" class="rounded-md bg-secondary-600 p-2" :class="`${layoutVertical ? 'w' : 'h'}-96`">
        <button v-if="!group?.length" class="opacity-50" v-text="'No panels in added yet.'"  />

        <div v-for="(panel, p) in group" :key="p">
          <div class="flex flex-col gap-1 border p-2 rounded-md bg-white my-2">
            <input class="border" type="text" />
            <select>
              <option>test</option>
            </select>
          </div>
        </div>

        <button class="border border-primary-600 rounded-md py-1 px-2 bg-primary-500" @click="addNewPanel(g)">
          <i class="fa fa-plus mr-2" />
          <span v-text="'Add new panel'" />
        </button>
      </div>

    </div>
    <button class="border border-primary-600 rounded-md py-1 px-2 bg-primary-500" @click="addNewGroup()">
          <i class="fa fa-plus mr-2" />
          <span v-text="`Add new ${layoutVertical ? 'column' : 'row'}`" />
      </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutOrientation',

  data() {
    return {
      layoutGroups: []
    }
  },

  computed: {
    layoutVertical(): Boolean {
      return this.$configuration?.orientation == 'vertical'
    },
    currentLayoutGroups(): Array{
      return this.$configuration.theLayout.groups
    },
    darkPrimaryColor(): Boolean{
      return this.$information?.isPrimaryColorDark;
    },
    darkSecondaryColor(): Boolean{
      return this.$information?.isSecondaryColorDark;
    },
  },

  mounted(){
    this.layoutGroups = this.currentLayoutGroups 
  },

  methods: {
    addNewGroup(){
      this.layoutGroups.push([])
    },

    addNewPanel(groupdId: Number){
      this.layoutGroups[groupdId].push({})
    }

    //this.$toast.success('Dashboard configuration was updated.')
  }
})
</script>
