import { defineStore } from 'pinia'

export const configuration = defineStore('configuration', {
  state: () => ({
    agents: [],
    groups: [],
    statuses: [],
    customFields: [],

    autoRefresh: {
      active: false,
      perMinutes: ''
    },

    layout: {
      direction: 'horizontal',
      leaderboardsLength: 5,
      autoHideTopBar: true,
      showThrophies: true,

      groups: [
        [
          {
            component: 'AgentLeaderboards',
            visible: true
          }
        ]
      ]
    }
  })
})
