import { defineStore } from 'pinia'
import { colorIsDark } from '@/helpers/CommonMethods'

const storeLocalStorageKey = 'stored_dashboard_information'

export const information = defineStore('information', {
  state: () => ({
    agents: [],
    groups: [],
    sources: [],
    statuses: [],
    priorities: [],
    
    filters: [],
    savedFilterSets: [],
    // new full store object
    adminTicketFields: [],

    ticketFields: new Array(),
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
    },

    months: [
      { value: 1, days: 31, label: 'January' },
      { value: 2, days: 28, label: 'February' },
      { value: 3, days: 31, label: 'March' },
      { value: 4, days: 30, label: 'April' },
      { value: 5, days: 31, label: 'May' },
      { value: 6, days: 30, label: 'June' },
      { value: 7, days: 31, label: 'July' },
      { value: 8, days: 31, label: 'August' },
      { value: 9, days: 30, label: 'September' },
      { value: 10, days: 31, label: 'October' },
      { value: 11, days: 30, label: 'November' },
      { value: 12, days: 31, label: 'December' }
    ],

    graphTypes: [
      { value: 'v-bar', label: 'Vertical bar charts' },
      { value: 'h-bar', label: 'Horizontal bar charts' },
      { value: 'pie', label: 'Pie chart' },
      { value: 'doughnut', label: 'Doughnut chart' },
      { value: 'polar-area', label: 'Polar-area chart' },
      { value: 'line', label: 'Line chart' },
      { value: 'bezier-line', label: 'Curved line chart' }
    ]
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
    storedSources(): Object {
      return this.sources
    },
    storedAdminTicketFields(): Object {
      return this.adminTicketFields
    },
    autoRefreshTimeShortcuts(): Array {
      return this.autoRefreshShortcuts
    },
    listOfAvailableTicketFields(): Array {
      return this.ticketFields
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
    conditionalPrimaryBorder(): String {
      return this.isSecondaryColorDark ? 'border-none' : 'border border-primary-500'
    }
  },

  actions: {
    setGroups(newValue: Array) {
      this.groups = newValue
      this.saveConfigurationToStore()
    },

    setAgents(newValue: Array) {
      this.agents = newValue
      this.saveConfigurationToStore()
    },

    setFilters(newValue: Array) {
      this.filters = newValue
      this.saveConfigurationToStore()
    },

    setStatuses(newValue: Array) {
      this.statuses = newValue
      this.saveConfigurationToStore()
    },

    setPriorities(newValue: Array) {
      this.priorities = newValue
      this.saveConfigurationToStore()
    },

    setSources(newValue: Array) {
      this.sources = newValue
      this.saveConfigurationToStore()
    },

    setAdminTicketFields(newValue: Array) {
      this.adminTicketFields = newValue
      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      const storeData = {
        agents: this.agents,
        groups: this.groups,
        sources: this.sources,
        filters: this.filters,
        statuses: this.statuses,
        priorities: this.priorities,
        ticketFields: this.ticketFields,
        adminTicketFields: this.adminTicketFields
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
        this.sources = stateFromStore?.sources
        this.statuses = stateFromStore?.statuses
        this.priorities = stateFromStore?.priorities
        this.ticketFields = stateFromStore?.ticketFieldsd
        this.adminTicketFields = stateFromStore?.adminTicketFields
      }
    },

    deleteStoredConfiguration() {
      this.agents = []
      this.groups = []
      this.filters = []
      this.sources = []
      this.statuses = []
      this.priorities = []
      this.ticketFields = []
      this.adminTicketFields = []
      localStorage.removeItem(storeLocalStorageKey)
    },

    saveTicketFields(ticket: Object) {
      const ignoredFields = [
        'id',
        'type',
        'tags',
        'stats',
        'status',
        'source',
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

      this.ticketFields = [Object.keys(ticket), Object.keys(ticket?.custom_fields)]
        .flat()
        .filter((field) => !ignoredFields.includes(field))
        .sort()

      this.saveConfigurationToStore()
    }
  }
})
