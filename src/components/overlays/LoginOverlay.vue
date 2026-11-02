<template>
  <a-overlay size="sm" body-class="px-6 pb-6 pt-2">
    <template #headerActions>
      <theme-toggle />
    </template>

    <form class="flex flex-col" @submit.prevent="authenticate()">
      <div class="flex flex-col items-center text-center mb-6">
        <logo-icon :pt-width="48" :pt-height="48" />
        <h2 class="mt-4 text-xl font-semibold" v-text="appTitle" />
        <p class="mt-1 text-sm text-ink-muted" v-text="subtitle" />
      </div>

      <div class="flex flex-col gap-4">
        <div v-if="!freshdeskDomainUrl">
          <label class="field-label" for="login-domain" v-text="'Freshdesk domain URL'" />
          <input
            id="login-domain"
            v-model="domainUrl"
            type="url"
            class="input"
            :placeholder="'https://your-domain.freshdesk.com/api/v2/'"
            autofocus
          />
        </div>

        <div v-if="!freshdeskApiKey">
          <label class="field-label" for="login-key" v-text="'API key'" />
          <input
            id="login-key"
            v-model="apiKey"
            type="password"
            class="input"
            autocomplete="off"
            :placeholder="'Your Freshdesk API key'"
          />
          <p
            class="mt-1.5 text-xs text-ink-muted"
            v-text="'Found in Freshdesk under Profile settings → View API key.'"
          />
        </div>

        <template v-if="freshdeskDomainUrl && freshdeskApiKey">
          <p
            v-if="!userCredentialsSet"
            class="rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm"
            v-text="'Credentials not set in env file!'"
          />

          <template v-else>
            <div>
              <label class="field-label" for="login-username" v-text="'Username'" />
              <input
                id="login-username"
                v-model="username"
                type="text"
                class="input"
                autocomplete="username"
                :placeholder="'john.doe@mail.com'"
                autofocus
              />
            </div>
            <div>
              <label class="field-label" for="login-password" v-text="'Password'" />
              <input
                id="login-password"
                v-model="password"
                type="password"
                class="input"
                autocomplete="current-password"
                :placeholder="'••••••••'"
              />
            </div>
          </template>
        </template>
      </div>

      <button type="submit" class="btn-primary w-full mt-6 py-2.5" v-text="'Sign in'" />
    </form>
  </a-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '@/components/general/TheLogo.vue'
import AOverlay from '@/components/general/AOverlay.vue'
import ThemeToggle from '@/components/general/ThemeToggle.vue'
import { checkAuthCredentials } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'LoginOverlay',

  components: { LogoIcon, AOverlay, ThemeToggle },

  data() {
    return {
      username: '',
      password: '',
      domainUrl: '',
      apiKey: ''
    }
  },

  computed: {
    freshdeskDomainUrl(): string {
      return import.meta.env.VITE_FRESHDESK_DOMAIN_URL ?? ''
    },
    freshdeskApiKey(): string {
      return import.meta.env.VITE_FRESHDESK_API_KEY ?? ''
    },
    userCredentialsSet(): boolean {
      return (
        import.meta.env.VITE_ACCESS_CONTROL_USERNAME != '' &&
        import.meta.env.VITE_ACCESS_CONTROL_PASSWORD != ''
      )
    },
    appTitle(): string {
      return import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'
    },
    subtitle(): string {
      return this.freshdeskDomainUrl && this.freshdeskApiKey
        ? 'Sign in to view the dashboard.'
        : 'Connect your Freshdesk account to get started.'
    }
  },

  watch: {
    domainUrl() {
      let domain = this.domainUrl

      if (domain && domain.charAt(domain.length - 1) != '/') {
        domain = domain.concat('/')
      }
      this.$auth.setNewDomainUrl(domain)
    },
    apiKey() {
      this.$auth.setNewApiKey(this.apiKey)
    }
  },

  created() {
    if (this.freshdeskDomainUrl) {
      this.domainUrl = this.freshdeskDomainUrl
    }
    if (this.freshdeskApiKey) {
      this.apiKey = this.freshdeskApiKey
    }

    if (!this.freshdeskDomainUrl && this.$auth?.domainURL) {
      this.domainUrl = this.$auth?.domainURL
    }
    if (!this.freshdeskApiKey && this.$auth?.apiKey) {
      this.apiKey = this.$auth?.apiKey
    }
  },

  // The dashboard watches the auth state and takes over once it is set.
  methods: {
    authenticate() {
      if (this.freshdeskDomainUrl && this.freshdeskApiKey) {
        checkAuthCredentials(this.username, this.password)
        return
      }

      if (!this.$auth?.domain || !this.$auth?.api_key) {
        this.$toast.error('Please enter your Freshdesk domain url and API key.')
        return
      }

      this.$auth.setAuthState(true)
    }
  }
})
</script>
