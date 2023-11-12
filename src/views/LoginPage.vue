<template>
  <the-layout>
    <div
      class="flex flex-col m-auto text-center w-9/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 shadow-lg rounded-lg p-5 mt-16 bg-none border"
    >
      <logo-icon pt-width="190" pt-height="190" class="m-auto shadow-lg rounded-full" />
      <p class="py-3 opacity-50 w-full" v-text="'Freshdesk Ticket Dashboard'" />
      <hr class="w-full my-2" />

      <form class="block w-full bg-none">
        <div v-if="!freshdeskDomainUrl" class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'Freshdesk Domain Url:'" />
          <input
            v-model="domainUrl"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'https://your-domain.freshdesk.com/api/v2/'"
          />
        </div>

        <div v-if="!freshdeskApiKey" class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'Freshdesk API Key:'" />
          <input
            v-model="apiKey"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'Your Freshdesk API key...'"
          />
        </div>

        <div class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'E-mail:'" />
          <input
            v-model="email"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'john.doe@mail.com'"
          />
        </div>

        <div class="grid grid-cols-1 text-left m-auto px-1 py-2">
          <label v-text="'Password:'" />
          <input
            v-model="password"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'********'"
          />
        </div>

        <button
          class="primary-button mt-5 w-full bg-primary text-secondary py-2 px-10"
          v-text="'Login'"
          @click.stop="authenticateWithFreshdesk()"
        />
      </form>
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheLayout from './TheLayout.vue'
import ApiCall from '../helpers/APICallHelper'
import axios from 'axios'
import LogoIcon from '../components/icons/LogoIcon.vue'
import { json } from 'node:stream/consumers'

export default defineComponent({
  name: 'LoginPage',

  components: { TheLayout, LogoIcon },

  data() {
    return {
      domainUrl: '',
      apiKey: '',
      email: '',
      password: ''
    }
  },

  computed: {
    freshdeskDomainUrl() {
      return import.meta.env.VITE_FRESHDESK_DOMAIN_URL ?? ''
    },
    freshdeskApiKey() {
      return import.meta.env.VITE_FRESHDESK_API_KEY ?? ''
    }
  },

  watch: {
    domainUrl() {
      this.$store.$state.domainUrl = this.domainUrl
    },
    apiKey() {
      this.$store.$state.apiKey = this.apiKey
    }
  },

  created() {
    if (this.freshdeskDomainUrl) {
      this.domainUrl = this.freshdeskDomainUrl
    }
    if (this.freshdeskApiKey) {
      this.apiKey = this.freshdeskApiKey
    }
  },

  methods: {
    authenticateWithFreshdesk() {
      this.performCall('tickets/1320')
    },

    performCall(path) {
      axios
        .get(this.freshdeskDomainUrl + path, {
          auth: {
            username: 'TkKD2GRNNL8SWWxm5ovz',
            password: 'X'
          }
        })
        .then((response) => {
          console.log(response)
        })
    }
  }
})
</script>
