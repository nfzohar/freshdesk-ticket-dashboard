import { defineStore } from 'pinia'
import { colorIsDark } from '@/helpers/CommonMethods'

const storeLocalStorageKey = 'stored_dashboard_information'

export const information = defineStore('information', {
  state: () => ({
    agents: [],
    groups: [],
    filters: [],
    statuses: [],
    priorities: [],

    listOfAvailableTicketFields: new Array(),
    isPrimaryColorDark: colorIsDark(import.meta.env.VITE_THEME_PRIMARY_COLOR),
    isSecondaryColorDark: colorIsDark(import.meta.env.VITE_THEME_SECONDARY_COLOR),

    autoRefreshShortcuts: [
      {
        label: '5 minutes',
        value: 5
      },
      {
        label: '10 minutes',
        value: 10
      },
      {
        label: '15 minutes',
        value: 15
      },
      {
        label: '30 minutes',
        value: 30
      },
      {
        label: '1 hour',
        value: 60
      },
      {
        label: '2 hours',
        value: 180
      }
    ],

    leaderboardsTrophy: {
      colors: ['text-yellow-500', 'text-gray-400', 'text-yellow-900'],
      icons: [
        {
          label: 'Trophy',
          value: 'fa fa-trophy'
        },
        {
          label: 'Medal',
          value: 'fa fa-medal'
        },
        {
          label: 'Award',
          value: 'fa fa-award'
        },
        {
          label: 'Star',
          value: 'fa fa-star'
        }
      ]
    }
  }),

  getters: {
    storedPriorities(): Object {
      return this.priorities
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
    },
    autoRefreshTimeShortcuts(): Array {
      return this.autoRefreshShortcuts
    },
    trophyIcons(): Array {
      return this.leaderboardsTrophy?.icons
    },
    trophyColors(): Array {
      return this.leaderboardsTrophy?.colors
    },
    textOnPrimaryColor(): String {
      return `text-${this.isPrimaryColorDark ? 'white' : 'black'}`
    },
    textOnSecondaryColor(): String {
      return `text-${this.isSecondaryColorDark ? 'white' : 'black'}`
    },
    bgAccentPrimaryColor(): String {
      return `bg-primary-${this.isPrimaryColorDark ? '600' : '400'}`
    },
    bgAccentSecondaryColor(): String {
      return `bg-secondary-${this.isSecondaryColorDark ? '600' : '400'}`
    },
    conditionalBorder(): String{
      return this.isSecondaryColorDark ? 'border-none' : 'border border-primary-500'
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

    setPriorities(newValue: Array) {
      this.priorities = newValue
    },

    saveConfigurationToStore() {
      const storeData = {
        agents: this.agents,
        groups: this.groups,
        filters: this.filters,
        statuses: this.statuses,
        priorities: this.priorities
      }
      localStorage.setItem(storeLocalStorageKey, JSON.stringify(storeData))
    },

    initializeStateFromStorage() {
      let stateFromStore = localStorage.getItem(storeLocalStorageKey)

      if (stateFromStore) {
        stateFromStore = JSON.parse(stateFromStore)

        this.agents = stateFromStore?.agents
        this.groups = stateFromStore?.groups
        this.filters = stateFromStore?.filters
        this.statuses = stateFromStore?.statuses
        this.priorities = stateFromStore?.priorities
      }
    },

    deleteStoredConfiguration() {
      this.agents = []
      this.groups = []
      this.filters = []
      this.filters = []
      this.priorities = []
      localStorage.removeItem(storeLocalStorageKey)
    },

    saveTicketFields(ticket: Object) {
      const ignoredFields = [
        'id',
        'tags',
        'stats',
        'status',
        'due_by',
        'subject',
        'fr_due_by',
        'requester',
        'updated_at',
        'created_at',
        'responder_id',
        'requester_id',
        'custom_fields'
      ]

      if (!ticket) {
        return
      }

      this.listOfAvailableTicketFields = [Object.keys(ticket), Object.keys(ticket?.custom_fields)]
        .flat()
        .filter((field) => !ignoredFields.includes(field))
        .sort()
    }
  }
})
