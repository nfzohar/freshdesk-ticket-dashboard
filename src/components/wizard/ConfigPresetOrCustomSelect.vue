<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <button
      v-for="(option, o) in options"
      :key="o"
      class="group flex flex-col items-start gap-4 rounded-xl border border-line bg-surface p-6 text-left transition hover:border-primary-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      @mouseenter="option.animate = true"
      @mouseleave="option.animate = false"
      @click="option.function"
    >
      <span
        class="grid place-items-center h-12 w-12 rounded-xl bg-primary/10 text-primary-500 text-xl"
      >
        <i :class="[option?.icon, { 'motion-safe:animate-bounce': option.animate }]" />
      </span>
      <span>
        <span class="block text-base font-semibold" v-text="option?.title" />
        <span class="block mt-1 text-sm text-ink-muted" v-text="option?.description" />
      </span>
      <span class="btn-primary mt-auto">
        <span v-text="option?.button" />
        <i class="fa fa-arrow-right" />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { presetPanels } from '@/helpers/LayoutGrid'

export default defineComponent({
  name: 'ConfigPresetOrCustomSelect',

  emits: ['usePreset', 'buildCustom'],

  data() {
    return {
      options: [
        {
          title: 'Use the configuration preset',
          description:
            'Use the out-of-the-box preset, that lets you get right into using the dashboard.',
          button: 'Preset',
          icon: 'fa fa-box-open',
          animate: false,
          function: () => this.loadPresetConfiguration()
        },
        {
          title: 'Build a custom configuration',
          description: 'Use the configuration wizard to create a customized dashboard.',
          button: 'Build custom',
          icon: 'fa fa-wrench',
          function: () => this.$emit('buildCustom')
        }
      ]
    }
  },

  computed: {
    primaryColorText(): String {
      return this.$information?.textOnPrimaryColor
    },
    secondaryColorText(): String {
      return this.$information?.textOnSecondaryColor
    }
  },

  methods: {
    async loadPresetConfiguration() {
      await this.setAutorefreshPreset()
      await this.setLeaderbordsPreset()
      await this.setLayoutPanelsPreset()
      this.$emit('usePreset')
    },

    setAutorefreshPreset() {
      let autoRefreshPreset = {
        active: false,
        perMinutes: 0
      }
      this.$configuration.updateAutoRefreshSettings(autoRefreshPreset)
      this.$toast.success('Dashboard configuration was updated.')
    },

    setLeaderbordsPreset() {
      let leaderboardsPreset = {
        length: 3,
        showThrophies: false,
        trophyIcon: 'fa fa-trophy'
      }
      this.$configuration.updateLeaderboardSettings(leaderboardsPreset)
      this.$toast.success('Dashboard configuration was updated.')
    },

    setLayoutPanelsPreset() {
      let layout = {
        autoHideToolbar: true,
        component: 'grid-layout',
        visibleTicketCounts: [],
        panels: presetPanels()
      }
      this.$configuration.updateLayout(layout)
      this.$toast.success('Dashboard configuration was updated.')
    }
  }
})
</script>
