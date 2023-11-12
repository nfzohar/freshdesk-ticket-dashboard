import { defineStore } from 'pinia'

export const Store = defineStore('default', {
  state: () => ({
    auth: false,
    domainURL: '',
    apiKey: ''
  }),

  getters: {
    authenticated(): Boolean {
      return this.auth
    },
    domain(): String {
      return this.domainURL
    },
    api_key(): String {
      return this.apiKey
    }
  },

  actions: {
    canAuthenticate(correctCredentials) {
      this.auth = correctCredentials
    },
    setNewDomainUrl(newDomainUrl) {
      this.domainURL = newDomainUrl
    },
    setNewApiKey(newApiKey) {
      this.apiKey = newApiKey
    }
  }
})
