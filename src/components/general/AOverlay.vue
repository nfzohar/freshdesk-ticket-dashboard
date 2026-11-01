<template>
  <div
    class="fixed inset-0 z-[200] flex overflow-y-auto scrollbar-hide backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-secondary-500 opacity-90" />

    <button
      v-if="closable"
      class="fixed right-4 top-4 z-10 bg-secondary-500 border border-primary-500 rounded-md"
      :title="'Close'"
      @click.stop="$emit('close')"
    >
      <i class="fa fa-times text-3xl px-2 py-1 text-primary-500" />
    </button>

    <div class="relative flex w-full min-h-full">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { listenForKey } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'AOverlay',

  emits: ['close'],

  props: {
    closable: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      removeEscListener: undefined as (() => void) | undefined
    }
  },

  mounted() {
    if (this.closable) {
      this.removeEscListener = listenForKey('Escape', () => this.$emit('close'))
    }
  },

  beforeUnmount() {
    this.removeEscListener?.()
  }
})
</script>
