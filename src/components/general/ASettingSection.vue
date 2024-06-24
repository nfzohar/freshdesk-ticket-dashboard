<template>
  <div class="bg-secondary-500 z-100 w-full p-4">
    <h1
      class="w-full border-b border-primary-600 font-bold mb-2 capitalize"
      v-text="sectionTitle"
    />
    <div class="bg-secondary-600 rounded-md" :class="bodyClass">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ASettingSection',

  props: {
    sectionTitle: {
      type: String,
      required: true
    },
    bodyClass: {
      type: String,
      required: true,
      default: 'flex items-center mb-5 px-5 py-3'
    }
  },
})
</script>
