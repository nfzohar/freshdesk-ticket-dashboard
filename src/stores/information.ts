import { defineStore } from 'pinia'
import { colorIsDark, ticketFieldOptions } from '@/helpers/CommonMethods'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage
} from '@/helpers/LocalStorageStore'

const storeLocalStorageKey = 'stored_dashboard_information'

export const information = defineStore('information', {
  state: () => ({
    filters: [] as any[],
    dateFilters: [] as any[],
    ticketFields: [] as any[],
    savedFilterSets: [] as any[],
    adminTicketFields: [] as any[],

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
    storedFilters(): any {
      return this.filters
    },
    storedDateFilters(): any {
      return this.dateFilters
    },
    storedAdminTicketFields(): any {
      return this.adminTicketFields
    },
    autoRefreshTimeShortcuts(): Array<any> {
      return this.autoRefreshShortcuts
    },
    listOfAvailableTicketFields(): Array<any> {
      return this.ticketFields
    },
    storedAgents(): any {
      return ticketFieldOptions(this.adminTicketFields, 'agent')
    },
    storedGroups(): any {
      return ticketFieldOptions(this.adminTicketFields, 'group')
    },
    storedStatuses(): any {
      return ticketFieldOptions(this.adminTicketFields, 'status')
    },
    storedSources(): any {
      return ticketFieldOptions(this.adminTicketFields, 'source')
    },
    storedPriorities(): any {
      return ticketFieldOptions(this.adminTicketFields, 'priority')
    },
    trophyIcons(): Array<any> {
      return this.leaderboardsTrophy?.icons
    },
    trophyColors(): Array<any> {
      return this.leaderboardsTrophy?.colors
    },
    // Theme-aware classes: the surface/ink tokens switch with light and dark mode,
    // and on-primary is derived from the primary colour at build time.
    textOnPrimaryColor(): string {
      return 'text-on-primary'
    },
    textOnSecondaryColor(): string {
      return 'text-ink'
    },
    bgAccentPrimaryColor(): string {
      return 'bg-primary-600'
    },
    bgAccentSecondaryColor(): string {
      return 'bg-surface-2'
    },
    conditionalPrimaryBorder(): string {
      return 'border border-line'
    }
  },

  actions: {
    setFilters(newValue: Array<any>) {
      this.filters = newValue
      this.saveConfigurationToStore()
    },

    setDateFilters(newValue: Array<any>) {
      this.dateFilters = newValue
      this.saveConfigurationToStore()
    },

    setFilterPresets(newValue: Array<any>) {
      this.savedFilterSets = newValue
      this.saveConfigurationToStore()
    },

    setAdminTicketFields(newValue: Array<any>) {
      this.adminTicketFields = newValue
      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      saveToLocalStorage(storeLocalStorageKey, {
        filters: this.filters,
        dateFilters: this.dateFilters,
        ticketFields: this.ticketFields,
        savedFilterSets: this.savedFilterSets,
        adminTicketFields: this.adminTicketFields
      })
    },

    initializeStateFromStorage() {
      const stateFromStore = loadFromLocalStorage(storeLocalStorageKey)

      if (stateFromStore) {
        this.filters = stateFromStore?.filters
        this.dateFilters = stateFromStore?.dateFilters
        this.ticketFields = stateFromStore?.ticketFields
        this.savedFilterSets = stateFromStore?.savedFilterSets
        this.adminTicketFields = stateFromStore?.adminTicketFields
      }
    },

    deleteStoredConfiguration() {
      this.filters = []
      this.dateFilters = []
      this.ticketFields = []
      this.savedFilterSets = []
      this.adminTicketFields = []
      removeFromLocalStorage(storeLocalStorageKey)
    },

    saveTicketFields(ticket: any) {
      const ignoredFields = [
        'id',
        'type',
        'tags',
        'stats',
        'status',
        'source',
        'subject',
        'fr_due_by',
        'requester',
        'responder_id',
        'requester_id',
        'custom_fields'
      ]

      if (!ticket) {
        return
      }

      this.ticketFields = new Array()

      const ticketFields = Object.keys(ticket ?? []).filter(
        (field) => !ignoredFields.includes(field)
      )
      const statsFields = Object.keys(ticket?.stats ?? []).map((stat) => `stats.${stat}`)
      const customFields = Object.keys(ticket?.custom_fields ?? []).map(
        (customField) => `custom_fields.${customField}`
      )

      this.ticketFields = [ticketFields, statsFields, customFields].flat().sort()
      this.saveConfigurationToStore()
    }
  }
})
