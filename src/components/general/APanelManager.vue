<template>
  <div
    class="flex flex-col items-center gap-3 w-full h-max border-primary-600 border rounded-md p-2"
    :class="`${accentSecondaryBg} ${textClass}`"
  >
    <input class="bg-primary-500 border-primary-600 w-full rounded-md p-1" type="text" />
    <a-select />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASelect from '@/components/general/ASelect.vue'

export default defineComponent({
  name: 'APanelManager',

  components: { ASelect },

  emits: ['panelUpdated'],

  props: {
    panel: {
      type: [Array, Object],
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      updateToken: 0
    }
  },

  computed: {
    textClass(): String {
      return this.$information?.textOnPrimaryColor
    },
    accentSecondaryBg(): String {
      return this.$information?.bgAccentSecondaryColor
    }
  }
})
</script>
