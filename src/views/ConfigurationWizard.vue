<template>
  <div class="w-screen h-screen overflow-hidden bg-secondary-500 py-24">
    <div class="w-11/12 md:w-10/12 h-11/12 m-auto">
      <h1 class="text-5xl w-full text-left p-5 font-bold" v-text="'Configuration Wizard'" />

      <div class="px-5" :class="{ 'border border-primary-500 rounded-md py-5': page }">
        <preset-or-custom-configuration
          v-if="!page"
          @usePreset="page = 9"
          @buildCustom="page = 1"
        />
        <component v-else :is="wizardComponent[page]" />
      </div>

      <div v-if="page" class="flex justify-between w-full py-5 px-3">
        <button class="wizard-navigation" v-text="'Back'" @click="page--" />
        <button class="wizard-navigation" v-text="'Next'" @click="page++" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LayoutOrientation from '@/components/wizard/LayoutOrientation.vue'
import AutoRefreshSettings from '@/components/wizard/AutoRefreshSettings.vue'
import LeaderboardsSettings from '@/components/wizard/LeaderboardsSettings.vue'
import PresetOrCustomConfiguration from '@/components/wizard/PresetOrCustomConfiguration.vue'

export default defineComponent({
  name: 'ConfigurationWizard',

  components: {
    PresetOrCustomConfiguration,
    AutoRefreshSettings,
    LeaderboardsSettings,
    LayoutOrientation
  },

  data() {
    return {
      page: 0,
      wizardComponent: ['', 'auto-refresh-settings', 'leaderboards-settings', 'layout-orientation']
    }
  },

  created() {
    //if (this.$configuration.layoutGroups?.length) {
    //}
  }
})
</script>

<style scoped>
.wizard-navigation {
  @apply w-52 px-4 py-2 border border-primary-600 bg-primary-500 rounded-md font-semibold;
}
</style>
