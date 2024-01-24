import { defineStore } from 'pinia'

export const dashboad_Settings = defineStore('dashboard_settings', {
  state: () => ({
    agents: [],
    groups: [],
    statuses: [],
    customFields: [],
    layout: {
      ticket_counts: {
        show: true,
        visibleCounts: ['All', 'Unresolved', 'Resolved', 'Closed']
      },
      types: {
        show: true
      },
      tags: {
        show: true
      },
      groups: {
        show: true
      },
      top_requesters: {
        show: true,
        settings: {
          showTrophies: true,
          listLentgh: 5
        }
      },
      top_agents: {
        show: true,
        settings: {
          showTrophies: true,
          listLentgh: 5
        }
      },
      ticket_open_closed_graph: {
        show: true
      },
      ticket_list: {
        show: true
      }
    }
  }),

  getters: {
    dashboardLayout(): Object {
      return this.layout
    },
    storedCustomFields(): Object {
      return this.customFields
    },
    storedStatuses(): Object {
      return this.statuses
    },
    storedAgents(): Object {
      return this.agents
    },
    storedGroups(): Object {
      return this.groups
    }
  },

  actions: {
    watch: {
      customFields(newValue: any, oldValue: any) {
        if (newValue != oldValue) {
          this.saveCustomFieldsToStore(newValue)
        }
      }
    },

    saveLayoutToStore(data: {
      ticket_counts: { show: boolean; visibleCounts: never[] }
      types: { show: boolean }
      tags: { show: boolean }
      groups: { show: boolean }
      top_requesters: { show: boolean; settings: { showTrophies: boolean; listLentgh: number } }
      top_agents: { show: boolean; settings: { showTrophies: boolean; listLentgh: number } }
      ticket_open_closed_graph: { show: boolean }
      ticket_list: { show: boolean }
    }) {
      this.layout = data
      localStorage.setItem('stored_layout', JSON.stringify(data))
    },

    saveCustomFieldsToStore(data: never[]) {
      this.customFields = data
      localStorage.setItem('stored_custom_fields', JSON.stringify(data))
    },

    initializeStateFromStorage() {
      this.loadLayoutFromStore()
      this.loadCustomFieldsFromStore()
    },

    loadLayoutFromStore() {
      const localLayout = localStorage.getItem('stored_layout')
      if (localLayout) {
        this.layout = JSON.parse(localLayout)
      }
    },

    loadCustomFieldsFromStore() {
      const localCustomFields = localStorage.getItem('stored_custom_fields')
      if (localCustomFields) {
        this.customFields = JSON.parse(localCustomFields)
      }
    },

    deleteStoreData() {
      this.agents = []
      this.groups = []
      this.statuses = []
      localStorage.removeItem('stored_layout')
      localStorage.removeItem('stored_custom_fields')
    }
  }
})
