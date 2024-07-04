<template>
  <div class="dashboard-body sm:py-10">
    <div class="w-11/12 md:w-11/12 h-11/12 m-auto">
      <h1 class="text-5xl w-full text-left p-5 font-bold" v-text="'Configuration Wizard'" />

      <div class="px-5" :class="{ 'border border-primary-500 rounded-md py-5 ': page }">
        <preset-or-custom-configuration
          v-if="!page"
          @buildCustom="page = 1"
          @usePreset="page = 5"
        />
        <tabs
          v-else
          :key="page"
          :tab-keywords="steps"
          :def-selected-tab="page"
          :select-tab-on-click="layoutGroupsAreDefined"
          @selectedTabIndex="(value) => (page = value)"
        >
          <template #tab_1>
            <auto-refresh-settings />
          </template>
          <template #tab_2>
            <leaderboards-settings />
          </template>
          <template #tab_3>
            <layout-component-selection />
          </template>
          <template #tab_4>
            <layout-setup />
          </template>
        </tabs>
      </div>

      <div v-if="page" class="flex justify-between w-full py-5 px-3">
        <button class="wizard-navigation" v-text="'Back'" @click="page--" />
        <button class="wizard-navigation" v-text="page < 4 ? 'Next' : 'Save'" @click="page++" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from '@/components/wizard/Tabs.vue'
import LayoutSetup from '@/components/wizard/LayoutSetup.vue'
import AutoRefreshSettings from '@/components/wizard/AutoRefreshSettings.vue'
import LeaderboardsSettings from '@/components/wizard/LeaderboardsSettings.vue'
import LayoutComponentSelection from '@/components/wizard/LayoutComponentSelection.vue'
import PresetOrCustomConfiguration from '@/components/wizard/PresetOrCustomConfiguration.vue'

export default defineComponent({
  name: 'ConfigurationWizard',

  components: {
    PresetOrCustomConfiguration,
    LayoutComponentSelection,
    AutoRefreshSettings,
    LeaderboardsSettings,
    LayoutSetup,
    Tabs
  },

  data() {
    return {
      page: 0,
      steps: [
        'Auto Refresh Settings',
        'Leaderboards Settings',
        'Layout Orientation',
        'Layout Setup'
      ]
    }
  },

  computed: {
    layoutGroupsAreDefined(): Boolean {
      return this.$configuration?.layoutGroups?.length ? true : false
    }
  },

  watch: {
    page() {
      if (this.page == 5) {
        this.$router.replace('/loading')
      }
    }
  },

  created() {
    this.page = this.layoutGroupsAreDefined ? 1 : 0
  }
})
</script>

<style scoped>
.wizard-navigation {
  @apply w-52 px-4 py-2 border border-primary-600 bg-primary-500 rounded-md font-semibold;
}
</style>
