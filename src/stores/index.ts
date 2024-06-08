import { defineStore } from 'pinia'

export const Store = defineStore('main', {
  state: () => ({
    auth: false,
    domainURL: '',
    apiKey: '',
    apiFilters: ''
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
    },
    filters(): String {
      return this.apiFilters
    }
  },

  actions: {
    watch: {
      domainURL(newValue: any, oldValue: any) {
        if (newValue != oldValue) {
          this.setNewDomainUrl(newValue)
        }
      },
      apiKey(newValue: any, oldValue: any) {
        if (newValue != oldValue) {
          this.setNewApiKey(newValue)
        }
      },
      auth(newValue: any, oldValue: any) {
        if (newValue != oldValue) {
          this.setAuthState(newValue)
        }
      },
      filters(newValue: any, oldValue: any) {
        if (newValue != oldValue) {
          this.setApiFilters(newValue)
        }
      }
    },

    canAuthenticate(correctCredentials: boolean) {
      this.auth = correctCredentials
    },

    setAuthState(newAuthState: boolean) {
      this.auth = newAuthState
      localStorage.setItem('stored_auth_state', JSON.stringify(newAuthState))
    },

    setApiFilters(newFilters: string) {
      this.apiFilters = newFilters
      localStorage.setItem('stored_filters', JSON.stringify(newFilters))
    },

    setNewDomainUrl(newDomainUrl: string) {
      this.domainURL = newDomainUrl
      localStorage.setItem('stored_domain_url', JSON.stringify(newDomainUrl))
    },

    setNewApiKey(newApiKey: string) {
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

      const apiFilters = localStorage.getItem('stored_filters')
      if (apiFilters) {
        this.apiFilters = JSON.parse(apiFilters)
      }
    },

    resetAuth() {
      this.auth = false
      this.domainURL = ''
      this.apiKey = ''
    }
  }
})
