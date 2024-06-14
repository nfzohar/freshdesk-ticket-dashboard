import { defineStore } from 'pinia'

const storeLocalStorageKey = 'stored_configuration'

export const configuration = defineStore('configuration', {
  state: () => ({
    agents: [],

    autoRefresh: {
      active: false,
      perMinutes: 0
    },

    leaderboards: {
      length: 5,
      showThrophies: true,
      trophyIcon: 'fa fa-trophy'
    },

    layout: {
      autoHideToolbar: true,
      direction: 'horizontal',
      groups: [
        [
          {
            id: '1-1',
            component: 'TicketTypesList',
            displayType: 'default',
            visible: true,
            data: {}
          },
          {
            id: '1-2',
            component: 'TicketTagsList',
            displayType: 'default',
            visible: true,
            data: {}
          },
          {
            id: '1-3',
            component: 'TicketGroupsList',
            displayType: 'default',
            visible: true,
            data: {}
          }
        ],
        [
          {
            id: '3-1',
            component: 'AgentsLeaderboard',
            displayType: 'default',
            visible: true,
            data: {}
          },
          {
            id: '3-2',
            component: 'RequestersLeaderboard',
            displayType: 'v-bar',
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
      return this.layout?.autoHideToolbar
    },
    layoutGroups(): Array {
      return this.layout?.groups
    },
    orientation(): String {
      return this.layout?.direction
    },
    trophyIcon(): String {
      return this.leaderboards?.trophyIcon
    },
    showTrophies(): Boolean {
      return this.leaderboards?.showThrophies
    },
    leaderboardsLength(): Number {
      return this.leaderboards?.length
    }
  },

  actions: {
    setGroups(newValue: Array) {
      this.groups = newValue
    },

    setAgents(newValue: Array) {
      this.agents = newValue
    },

    setFilters(newValue: Array) {
      this.filters = newValue
    },

    setStatuses(newValue: Array) {
      this.statuses = newValue
    },

    updateLayout(layout: Array) {
      this.layout = layout
      this.saveConfigurationToStore()
    },

    updateLayoutGroups(layoutGroups: Array) {
      this.layout.groups = layoutGroups
      this.saveConfigurationToStore()
    },

    updateAutoRefreshSettings(autoRefresh: Object) {
      this.autoRefresh = autoRefresh
      this.saveConfigurationToStore()
    },

    updateLeaderboardSettings(leaderboards: Object) {
      this.leaderboards = leaderboards
      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      const storeData = {
        layout: this.layout,
        autoRefresh: this.autoRefresh,
        leaderboards: this.leaderboards
      }

      localStorage.setItem(storeLocalStorageKey, JSON.stringify(storeData))
    },

    initializeConfigurationFromStorage() {
      let configurationFromStore = localStorage.getItem(storeLocalStorageKey)

      if (configurationFromStore) {
        configurationFromStore = JSON.parse(configurationFromStore)

        this.layout = configurationFromStore?.layout
        this.autoRefresh = configurationFromStore?.autoRefresh
        this.leaderboards = configurationFromStore?.leaderboards
      }
    },

    deleteStoredConfiguration() {
      this.agents = []
      this.groups = []
      this.statuses = []
      localStorage.removeItem(storeLocalStorageKey)
    }
  }
})
