import { defineStore } from 'pinia'

export const Store = defineStore('default', {
  state: () => ({
    authToken: '',
    domainURL: '',
    apiKey: '',
    user: {
      username: '',
      password: ''
    },
    auth: false
  }),

  actions: {
    authenticateUser() {}
  }
})
