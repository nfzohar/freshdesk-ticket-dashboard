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

    layout: {
      showThrophies: true,
      autoHideTopBar: true,
      leaderboardsLength: 5,
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

    panelGroups(): Object {
      return this.layout.groups
    },
    orientation(): String {
      return this.layout.direction
    },
    showTrophies(): Boolean {
      return this.layout.showThrophies
    },
    autoHideTopBar(): Boolean {
      return this.layout.autoHideTopBar
    },
    leaderboardsLength(): Number {
      return this.layout.leaderboardsLength
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

      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      const storeData = {
        layout: this.layout,
        autoRefresh: this.autoRefresh
      }

      localStorage.setItem('stored_configuration', JSON.stringify(storeData))
    },

    initializeConfigurationFromStorage() {
      const storedConfiguration = localStorage.getItem('stored_configuration')

      if (storedConfiguration) {
        this.layout = JSON.parse(storedConfiguration.layout)
        this.autoRefresh = JSON.parse(storedConfiguration.autoRefresh)
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
