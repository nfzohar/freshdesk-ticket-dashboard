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
        show: true,
      },
      tags: {
        show: true,
      },
      groups: {
        show: true,
      },
      top_requesters: {
        show: true,
        settings: {}
      },
      top_agents: {
        show: true,
        settings: {}
      },
      ticket_list: {
        show: true
      }
    }
  })
})
