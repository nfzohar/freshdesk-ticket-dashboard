<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 py-2">
    <div>
      <h3 class="text-base font-semibold" v-text="'Layout orientation'" />
      <p class="mt-1 text-sm text-ink-muted" v-text="pageTitle" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup">
      <button
        v-for="(option, o) in orientations"
        :key="o"
        class="group flex flex-col items-center gap-3 rounded-xl border-2 p-6 font-medium transition"
        :class="
          currentlySelectedLayout == option.value
            ? 'border-primary-500 bg-primary/10'
            : 'border-line bg-surface hover:border-primary/60 hover:bg-surface-2'
        "
        role="radio"
        :aria-checked="currentlySelectedLayout == option.value"
        @click="setLayoutOrientation(option.value)"
      >
        <span
          class="grid place-items-center h-14 w-14 rounded-xl text-2xl"
          :class="
            currentlySelectedLayout == option.value
              ? 'bg-primary-500 text-on-primary'
              : 'bg-surface-2 text-ink-muted'
          "
        >
          <i :class="[option?.icon, option.iconClass]" />
        </span>
        <span v-text="option?.label" />
        <span class="text-xs font-normal text-ink-muted" v-text="option?.description" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayoutOrientation',

  data() {
    return {
      pageTitle: `Select your dashboard's layout:`,
      orientations: [
        {
          icon: 'fa fa-table-cells-large',
          iconClass: '',
          label: 'Grid',
          description: 'Arrange and resize panels freely.',
          value: 'grid-layout'
        },
        {
          icon: 'fa fa-film',
          iconClass: '',
          label: 'Carousel',
          description: 'Counters on top, panels rotate below.',
          value: 'spin-layout'
        }
      ]
    }
  },

  computed: {
    currentlySelectedLayout(): string {
      return this.$configuration?.layoutComponent
    },
    primaryColorText(): string {
      return this.$information?.textOnPrimaryColor
    },
    secondaryColorText(): string {
      return this.$information?.textOnSecondaryColor
    }
  },

  methods: {
    setLayoutOrientation(value: string) {
      let newLayout = this.$configuration.theLayout
      newLayout.component = value

      this.$configuration.updateLayout(newLayout)
      this.$toast.success('Dashboard configuration was updated.')
    }
  }
})
</script>
