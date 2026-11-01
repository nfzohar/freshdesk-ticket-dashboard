<template>
  <div
    v-if="variant == 'segmented'"
    class="inline-flex rounded-lg border border-line bg-surface-2 p-1 gap-1"
    role="radiogroup"
    :aria-label="'Theme'"
  >
    <button
      v-for="option in options"
      :key="option.value"
      class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
      :class="
        theme.preference == option.value
          ? 'bg-surface text-ink shadow-sm'
          : 'text-ink-muted hover:text-ink'
      "
      role="radio"
      :aria-checked="theme.preference == option.value"
      @click="setThemePreference(option.value)"
    >
      <i :class="option.icon" />
      <span v-text="option.label" />
    </button>
  </div>

  <button
    v-else
    class="actions-button"
    :title="`Theme: ${current.label} (click to change)`"
    @click="cycle"
  >
    <i :class="current.icon" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { theme, setThemePreference, type ThemePreference } from '@/helpers/Theme'

export default defineComponent({
  name: 'ThemeToggle',

  props: {
    // 'icon' cycles through the options; 'segmented' shows all three.
    variant: {
      type: String,
      required: false,
      default: 'icon'
    }
  },

  data() {
    return {
      theme,
      options: [
        { value: 'light' as ThemePreference, label: 'Light', icon: 'fa fa-sun' },
        { value: 'dark' as ThemePreference, label: 'Dark', icon: 'fa fa-moon' },
        { value: 'system' as ThemePreference, label: 'System', icon: 'fa fa-desktop' }
      ]
    }
  },

  computed: {
    current() {
      return this.options.find((option) => option.value == theme.preference) ?? this.options[2]
    }
  },

  methods: {
    setThemePreference,

    cycle() {
      const index = this.options.findIndex((option) => option.value == theme.preference)
      setThemePreference(this.options[(index + 1) % this.options.length].value)
    }
  }
})
</script>
