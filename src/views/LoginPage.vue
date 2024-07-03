<template>
  <div class="flex flex-col transition-colors dashboard-body">
    <div
      class="flex flex-col m-auto text-center w-9/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 shadow-lg rounded-lg p-5 mt-16 bg-none border border-primary-500"
    >
      <logo-icon pt-width="190" pt-height="190" class="m-auto shadow-lg rounded-full" />
      <p class="py-3 opacity-50 w-full" v-text="appTitle" />
      <hr class="w-full my-2 border-primary-500" />

      <div class="block w-full bg-none">
        <div v-if="!freshdeskDomainUrl" class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'Freshdesk Domain Url:'" />
          <input
            v-model="domainUrl"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base text-black"
            :placeholder="'https://your-domain.freshdesk.com/api/v2/'"
            autofocus
          />
        </div>

        <div v-if="!freshdeskApiKey" class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'Freshdesk API Key:'" />
          <input
            v-model="apiKey"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base text-black"
            :placeholder="'Your Freshdesk API key...'"
          />
        </div>

        <template v-if="freshdeskDomainUrl && freshdeskApiKey">
          <span
            v-if="!userCredentialsSet"
            class="block font-semibold my-3"
            v-text="'Credentials not set in env file!'"
          />

          <section v-else @keydown.enter="authenticate()">
            <div class="grid grid-cols-1 text-left m-auto px-1 py-2">
              <label v-text="'Username:'" />
              <input
                v-model="username"
                type="text"
                class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base text-black"
                :placeholder="'john.doe@mail.com'"
                autofocus
              />
            </div>
            <div class="grid grid-cols-1 text-left m-auto px-1 py-2">
              <label v-text="'Password:'" />
              <input
                v-model="password"
                type="password"
                class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base text-black"
                :placeholder="'********'"
              />
            </div>
          </section>
        </template>

        <button
          class="primary-button mt-5 w-full bg-primary-500 hover:bg-primary-600 text-secondary-500 border-secondary-500 py-2 px-10"
          v-text="'Login'"
          @click.stop="authenticate()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '@/components/general/TheLogo.vue'
import { checkAuthCredentials } from '@/helpers/CommonMethods'

export default defineComponent({
  name: 'LoginPage',

  components: { LogoIcon },

  data() {
    return {
      username: '',
      password: '',
      domainUrl: '',
      apiKey: ''
    }
  },

  computed: {
    freshdeskDomainUrl() {
      return import.meta.env.VITE_FRESHDESK_DOMAIN_URL ?? ''
    },
    freshdeskApiKey() {
      return import.meta.env.VITE_FRESHDESK_API_KEY ?? ''
    },
    userCredentialsSet() {
      return (
        import.meta.env.VITE_ACCESS_CONTROL_USERNAME != '' &&
        import.meta.env.VITE_ACCESS_CONTROL_PASSWORD != ''
      )
    },
    appTitle() {
      return import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'
    }
  },

  watch: {
    domainUrl() {
      this.$auth.setNewDomainUrl(this.domainUrl)
    },
    apiKey() {
      this.$auth.setNewApiKey(this.apiKey)
    },
    '$auth.authenticated'() {
      if (this.$auth?.authenticated) {
        this.redirectAfterAuth()
      }
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

  mounted() {
    if (this.$auth?.authenticated) {
      this.redirectAfterAuth()
    }
  },

  methods: {
    authenticate() {
      if (this.freshdeskDomainUrl && this.freshdeskApiKey) {
        checkAuthCredentials(this.username, this.password)
        return
      }

      this.$auth.setAuthState(this.$auth?.domain && this.$auth?.api_key)
      this.redirectAfterAuth()
    },

    redirectAfterAuth() {
      let layoutDefined = this.$configuration.theLayout?.groups.length > 0
      this.$router.push(layoutDefined ? '/loading' : '/setup')
    }
  }
})
</script>
