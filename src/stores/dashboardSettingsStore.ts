import { defineStore } from 'pinia'

export const dashboad_Settings = defineStore('dashboard_settings', {
  state: () => ({
    layout: {
      ticket_counts: true,
      tags: true,
      groups: true,
      top_requesters: true,
      ticket_filters: true,
      ticket_list: true
    }
  })
})


/*

    layout: {
      ticket_counts: {
        show: true,
        settings: {
          
        }
      },
      tags: true,
      groups: true,
      top_requesters: true,
      ticket_list: true
    }
*/