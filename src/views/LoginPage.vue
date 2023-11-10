<template>
  <the-layout>
    <div
      class="flex flex-col m-auto text-center w-9/12 md:w-4/12 shadow-lg rounded-lg p-5 mt-16 bg-white"
    >
      <logo-icon class="m-auto w-6/12 h-6/12 shadow-lg rounded-full" />
      <span class="py-3 mb-3 text-gray-400 w-full border-b" v-text="loginMessage" />

      <form class="block w-full bg-none" @submit="authenticateWithFreshdesk()">
        <div v-if="freshdeskDomainUrl" class="grid grid-cols-1 text-left m-auto p-2">
          <label v-text="'Freshdesk Domain Url:'" />
          <input
            v-model="inputs.domainUrl"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            placeholder="Your freshdesk's domain url..."
          />
        </div>

        <div v-if="freshdeskApiKey" class="grid grid-cols-1 text-left m-auto p-2">
          <label v-text="'Freshdesk API Key:'" />
          <input
            v-model="inputs.apiKey"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            placeholder="Your freshdesk's API key..."
          />
        </div>

        <div class="grid grid-cols-1 text-left m-auto p-2">
          <label v-text="'E-mail:'" />
          <input
            v-model="inputs.email"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'E-mail...'"
          />
        </div>

        <div class="grid grid-cols-1 text-left m-auto p-2">
          <label v-text="'Password:'" />
          <input
            v-model="inputs.password"
            type="text"
            class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
            :placeholder="'Password...'"
          />
        </div>

        <button class="mt-5 primary-button py-2 px-10" v-text="'Login'" />
      </form>
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LogoIcon from '../components/icons/LogoIcon.vue'
import TheLayout from './TheLayout.vue'
import axios from 'axios'

export default defineComponent({
  name: 'LoginPage',

  components: { TheLayout, LogoIcon },

  data() {
    return {
      logoUrl: '/src/assets/logo.svg',
      loginMessage: 'Freshdesk Ticket Dashboard',

      inputs: {
        domainUrl: '',
        apiKey: '',
        email: '',
        password: ''
      }
    }
  },

  computed: {
    freshdeskDomainUrl() {
      return true
    },
    freshdeskApiKey() {
      return true
    }
  },

  methods: {
    authenticateWithFreshdesk() {
      axios.get('google')
    }
  }
})
</script>
