import { defineStore } from 'pinia'

const storeLocalStorageKey = 'stored_authentication'

export const auth = defineStore('auth', {
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
    setAuthState(newAuthState: boolean) {
      this.auth = newAuthState ? true : false
      this.saveConfigurationToStore()
    },

    setNewDomainUrl(newDomainUrl: string) {
      this.domainURL = newDomainUrl
      this.saveConfigurationToStore()
    },

    setNewApiKey(newApiKey: string) {
      this.apiKey = newApiKey
      this.saveConfigurationToStore()
    },

    initializeStateFromStorage() {
      let stateFromStore = localStorage.getItem(storeLocalStorageKey)

      if (stateFromStore) {
        stateFromStore = JSON.parse(stateFromStore)

        this.auth = stateFromStore?.authenticated
        this.apiKey = stateFromStore?.api_domain
        this.domainURL = stateFromStore?.api_key
      }
    },

    saveConfigurationToStore() {
      const authState = {
        authenticated: this.authenticated,
        api_domain: this.domain,
        api_key: this.api_key
      }
      localStorage.setItem(storeLocalStorageKey, JSON.stringify(authState))
    },

    logout() {
      this.auth = false
      this.domainURL = ''
      this.apiKey = ''
    }
  }
})
