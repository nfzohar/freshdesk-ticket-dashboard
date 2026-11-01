<template>
  <section class="w-full rounded-xl border border-line bg-surface p-4">
    <h3 class="mb-3 text-sm font-semibold text-ink capitalize" v-text="sectionTitle" />
    <div :class="bodyClass">
      <slot />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ASection',

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
  }
})
</script>
