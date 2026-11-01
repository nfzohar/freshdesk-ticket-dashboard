<template>
  <div
    class="flex items-center gap-3 w-full h-full rounded-lg bg-surface-2/70 px-3 py-2.5 transition-colors hover:bg-surface-2"
  >
    <slot v-if="$slots['card-icon']" :name="'card-icon'" />

    <div class="flex flex-col min-w-0 flex-1">
      <span class="truncate text-sm font-medium" :title="name" v-text="name ?? 'N/A'" />
      <span
        v-if="subtitle"
        class="truncate text-xs text-ink-muted"
        :title="subtitle"
        v-text="subtitle"
      />
    </div>

    <div class="flex flex-col items-end shrink-0" :title="countLabel">
      <span class="text-lg font-semibold tabular-nums leading-6" v-text="count ?? 0" />
      <span class="text-[11px] text-ink-muted" v-text="countLabel" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ACard',

  props: {
    name: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    },
    count: {
      type: [Number, String],
      required: false,
      default: 0
    },
    countLabel: {
      type: String,
      required: false,
      default: 'Count of tickets'
    }
  },

  computed: {
    primaryColorIsDark(): Boolean {
      return this.$information.isPrimaryColorDark
    }
  }
})
</script>
