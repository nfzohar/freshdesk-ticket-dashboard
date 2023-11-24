import { defineStore } from 'pinia'

export const Store = defineStore('main', {
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
    watch: {
      domainURL(newValue, oldValue) {
        if (newValue != oldValue) {
          this.setNewDomainUrl(newValue)
        }
      },
      apiKey(newValue, oldValue) {
        if (newValue != oldValue) {
          this.setNewApiKey(newValue)
        }
      },
      auth(newValue, oldValue) {
        if (newValue != oldValue) {
          this.setAuthState(newValue)
        }
      }
    },

    canAuthenticate(correctCredentials) {
      this.auth = correctCredentials
    },

    setAuthState(newAuthState) {
      this.auth = newAuthState
      localStorage.setItem('stored_auth_state', JSON.stringify(newAuthState))
    },

    setNewDomainUrl(newDomainUrl) {
      this.domainURL = newDomainUrl
      localStorage.setItem('stored_domain_url', JSON.stringify(newDomainUrl))
    },

    setNewApiKey(newApiKey) {
      this.apiKey = newApiKey
      localStorage.setItem('stored_api_key', JSON.stringify(newApiKey))
    },

    initializeStateFromStorage() {
      const authenticated = localStorage.getItem('stored_auth_state')
      if (authenticated) {
        this.auth = JSON.parse(authenticated)
      }

      const domainURL = localStorage.getItem('stored_domain_url')
      if (domainURL) {
        this.domainURL = JSON.parse(domainURL)
      }

      const apiKey = localStorage.getItem('stored_api_key')
      if (apiKey) {
        this.apiKey = JSON.parse(apiKey)
      }
    },

    resetAuth() {
      this.auth = false
      this.domainURL = ''
      this.apiKey = ''
    }
  }
})
