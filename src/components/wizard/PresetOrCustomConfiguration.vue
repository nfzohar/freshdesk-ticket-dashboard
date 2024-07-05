<template>
  <div class="flex items-center text-center gap-10">
    <div
      v-for="(option, o) in options"
      :key="o"
      class="flex flex-col w-full p-5 gap-y-3 lg:p-10 border border-primary-500 rounded-md"
    >
      <h2 class="uppercase font-bold text-base lg:text-lg xl:text-2xl" v-text="option?.title" />
      <p v-text="option?.description" />
      <button
        class="flex flex-col items-center border-4 border-primary-600 bg-primary-500 rounded-md py-5 px-10 m-auto font-bold"
        :class="'hover:bg-primary-600 hover:border-primary-500'"
        @mouseenter="option.animate = true"
        @mouseleave="option.animate = false"
        @click="option.function"
      >
        <i class="text-7xl p-5" :class="[option?.icon, { 'animate-bounce': option.animate }]" />
        <span v-text="option?.button" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultOrCustomConfiguration',

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
        length: 5,
        showThrophies: false,
        trophyIcon: 'fa fa-trophy',
        trophyColors: ['text-yellow-500', 'text-gray-400', 'text-amber-900']
      }
      this.$configuration.updateLeaderboardSettings(leaderboardsPreset)
      this.$toast.success('Dashboard configuration was updated.')
    },

    setLayoutPanelsPreset() {
      let layout = {
        autoHideToolbar: true,
        component: 'rows-layout',
        visibleTicketCounts: [],
        groups: [
          [
            {
              id: '1-1',
              component: 'TicketCounters',
              displayType: 'default',
              visible: true,
              sortBy: {},
              data: {}
            }
          ],
          [
            {
              id: '2-1',
              component: 'TicketTypesList',
              displayType: 'default',
              visible: true,
              sortBy: {},
              data: {}
            },
            {
              id: '2-1',
              component: 'TicketTagsList',
              displayType: 'default',
              visible: true,
              sortBy: {},
              data: {}
            },
            {
              id: '2-2',
              component: 'TicketGroupsList',
              displayType: 'default',
              visible: true,
              sortBy: {},
              data: {}
            }
          ],
          [
            {
              id: '3-1',
              component: 'AgentsLeaderboard',
              displayType: 'default',
              visible: true,
              sortBy: {},
              data: {}
            },
            {
              id: '3-2',
              component: 'RequestersLeaderboard',
              displayType: 'v-bar',
              visible: true,
              sortBy: {},
              data: {}
            }
          ]
        ]
      }
      this.$configuration.updateLayout(layout)
      this.$toast.success('Dashboard configuration was updated.')
    }
  }
})
</script>
