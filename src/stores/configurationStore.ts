import { defineStore } from 'pinia'

export const configuration = defineStore('configuration', {
  state: () => ({
    agents: [],
    groups: [],
    filters: [],
    statuses: [],

    autoRefresh: {
      active: false,
      perMinutes: ''
    },

    leaderboards: {
      length: 5,
      showThrophies: true,
      trophyIcon: 'fa fa-trophy',
      trophyColors: ['text-yellow-500', 'text-gray-400', 'text-amber-900']
    },

    layout: {
      autoHideToolbar: true,
      direction: 'horizontal',

      groups: [
        [
          {
            component: 'AgentLeaderboards',
            visible: true,
            data: {}
          }
        ]
      ]
    }
  }),

  getters: {
    theLayout(): Object {
      return this.layout
    },
    theAutoRefresh(): Object {
      return this.autoRefresh
    },
    autoHideToolbar(): Boolean {
      return this.layout.autoHideToolbar
    },

    panelGroups(): Object {
      return this.layout.groups
    },
    orientation(): String {
      return this.layout.direction
    },
    trophyIcon(): String {
      return this.leaderboards.trophyIcon
    },
    trophyColors(): Array {
      return this.leaderboards.trophyColors
    },
    showTrophies(): Boolean {
      return this.leaderboards.showThrophies
    },
    leaderboardsLength(): Number {
      return this.leaderboards.length
    },

    storedStatuses(): Object {
      return this.statuses
    },
    storedAgents(): Object {
      return this.agents
    },
    storedGroups(): Object {
      return this.groups
    },
    storedFilters(): Object {
      return this.filters
    }
  },

  actions: {
    updateCurrentConfiguration(data: Object) {
      this.layout = data?.layout
      this.autoRefresh = data.autoRefresh
      this.leaderboards = data.leaderboards

      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      const storeData = {
        layout: this.layout,
        autoRefresh: this.autoRefresh,
        leaderboards: this.leaderboards
      }

      localStorage.setItem('stored_configuration', JSON.stringify(storeData))
    },

    initializeConfigurationFromStorage() {
      const storedConfiguration = localStorage.getItem('stored_configuration')

      if (storedConfiguration) {
        this.layout = JSON.parse(storedConfiguration.layout)
        this.autoRefresh = JSON.parse(storedConfiguration.autoRefresh)
        this.leaderboards = JSON.parse(storedConfiguration.leaderboards)
      }
    },

    deleteStoredConfiguration() {
      this.agents = []
      this.groups = []
      this.statuses = []
      localStorage.removeItem('stored_configuration')
    },

    loadConfigurationPreset() {
      return ''
    }
  }
})
