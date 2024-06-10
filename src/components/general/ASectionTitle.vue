<template>
  <div class="flex items-center justify-between">
    <h1
      class="text-xl font-bold mb-1 cursor-pointer"
      :class="{
        'border-l-4 border-primary-400 bg-secondary-600 pr-2 pl-1 rounded-r-md': !sectionVisible
      }"
      v-text="theText"
      @click.stop="$emit('toggleVisibility')"
    />

    <div v-if="sectionVisible" class="flex items-center gap-x-2">
      <button
        v-if="showRecolorButton"
        class="hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600 p-1 w-6 h-6 rounded-full"
        :title="'Generate new graph color palette'"
        @click="$emit('recolorGraph')"
      >
        <!-- <brush-icon pt-width="12pt" pt-height="12pt" /> -->
      </button>
      <button
        v-if="showSwitchButton"
        class="hover:bg-primary-500 hover:shadow-md hover:shadow-primary-600 w-6 h-6 rounded-full"
        :title="'Switch display type'"
        @click="$emit('switchView')"
      >
        <!-- <switch-icon pt-width="18pt" pt-height="18pt" /> -->
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// import BrushIcon from '@/components/icons/BrushIcon.vue'
// import SwitchIcon from '@/components/icons/SwitchIcon.vue'

export default {
  name: 'SectionTitle',

  // components: { SwitchIcon, BrushIcon },

  props: {
    theText: {
      type: String,
      required: false,
      default: ''
    },
    sectionVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    showSwitchButton: {
      type: Boolean,
      required: false,
      default: true
    },
    showRecolorButton: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  emits: ['toggleVisibility', 'switchView', 'recolorGraph']
}
</script>
