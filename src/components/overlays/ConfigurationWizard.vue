<template>
  <a-overlay
    size="xl"
    icon="fa fa-wand-magic-sparkles"
    :title="'Configuration wizard'"
    :subtitle="subtitle"
    :closable="closable"
    @close="$emit('close')"
  >
    <config-preset-or-custom-select
      v-if="!page"
      @buildCustom="page = 1"
      @usePreset="page = steps.length + 1"
    />
    <tabs
      v-else
      :key="page"
      :tab-keywords="steps"
      :def-selected-tab="page"
      :select-tab-on-click="layoutDefined"
      @selectedTabIndex="(value) => (page = value)"
    >
      <template #tab_1>
        <auto-refresh-settings />
      </template>
      <template #tab_2>
        <leaderboards-settings />
      </template>
      <template #tab_3>
        <layout-selection />
      </template>
    </tabs>

    <template v-if="page" #footer>
      <button class="btn-secondary" @click="page--">
        <i class="fa fa-arrow-left" />
        <span v-text="'Back'" />
      </button>
      <button class="btn-primary" @click="page++">
        <span v-text="page < steps.length ? 'Next' : 'Finish'" />
        <i :class="page < steps.length ? 'fa fa-arrow-right' : 'fa fa-check'" />
      </button>
    </template>
  </a-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from '@/components/wizard/Tabs.vue'
import AOverlay from '@/components/general/AOverlay.vue'
import LayoutSelection from '@/components/wizard/LayoutSelection.vue'
import AutoRefreshSettings from '@/components/wizard/AutoRefreshSettings.vue'
import LeaderboardsSettings from '@/components/wizard/LeaderboardsSettings.vue'
import ConfigPresetOrCustomSelect from '@/components/wizard/ConfigPresetOrCustomSelect.vue'

export default defineComponent({
  name: 'ConfigurationWizard',

  emits: ['close', 'finished'],

  props: {
    // False on first setup: the dashboard cannot render without a layout.
    closable: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  components: {
    AOverlay,
    ConfigPresetOrCustomSelect,
    AutoRefreshSettings,
    LeaderboardsSettings,
    LayoutSelection,
    Tabs
  },

  data() {
    return {
      page: 0,
      steps: ['Auto Refresh Settings', 'Leaderboards Settings', 'Layout Orientation']
    }
  },

  computed: {
    layoutDefined(): boolean {
      return this.$configuration?.layoutPanels?.length > 0
    },
    subtitle(): string {
      return this.page && this.page <= this.steps.length
        ? `Step ${this.page} of ${this.steps.length} · ${this.steps[this.page - 1]}`
        : 'Start from a preset or build your own dashboard layout.'
    }
  },

  watch: {
    page() {
      // Panels are arranged afterwards, in the dashboard's edit mode.
      if (this.page > this.steps.length) {
        this.$emit('finished')
      }
    }
  },

  created() {
    this.page = this.layoutDefined ? 1 : 0
  }
})
</script>
