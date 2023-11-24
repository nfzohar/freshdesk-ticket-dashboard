import { defineStore } from 'pinia'

export const dashboad_Settings = defineStore('dashboard_settings', {
  state: () => ({
    statuses: [],
    customFields: [],
    layout: {
      ticket_counts: {
        show: true,
        settings: {}
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
      ticket_list: {
        show: true
      }
    }
  }),

  getters: {
    dashboardLayout(): Object {
      return this.layout
    },
    getCustomFields(): Object {
      return this.customFields
    },
    getStatuses(): Object {
      return this.statuses
    }
  },

  actions: {
    watch: {
      layout(newValue, oldValue) {
        if (newValue != oldValue) {
          this.saveLayoutToStore(newValue)
        }
      },
      customFields(newValue, oldValue) {
        if (newValue != oldValue) {
          this.saveCustomFieldsToStore(newValue)
        }
      }
    },

    saveLayoutToStore(data) {
      this.layout = data
      localStorage.setItem('stored_layout', JSON.stringify(data))
    },

    saveCustomFieldsToStore(data) {
      this.customFields = data
      localStorage.setItem('stored_custom_fields', JSON.stringify(data))
    },

    initializeStateFromStorage() {
      const localLayout = localStorage.getItem('stored_layout')
      if (localLayout) {
        this.layout = JSON.parse(localLayout)
      }

      const localCustomFields = localStorage.getItem('stored_custom_fields')
      if (localCustomFields) {
        this.customFields = JSON.parse(localCustomFields)
      }
    },

    deleteStoreData() {
      localStorage.removeItem('stored_layout')
      localStorage.removeItem('stored_custom_fields')
    }
  }
})
