<template>
  <the-layout>
    <div
      class="flex flex-col m-auto text-center w-9/12 md:w-6/12 xl:w-4/12 2xl:w-3/12 shadow-lg rounded-lg p-5 mt-16 bg-none border"
    >
      <logo-icon pt-width="190" pt-height="190" class="m-auto shadow-lg rounded-full" />

      <p class="py-3 opacity-50 w-full" v-text="'Freshdesk Ticket Dashboard'"/>

      <hr class="w-full my-2">

      <form class="block w-full bg-none" @submit="authenticateWithFreshdesk()">
        <template v-for="(input, i) in inputs" :key="i">
           <div v-if="input.show" class="grid grid-cols-1 text-left m-auto py-2 px-1">
              <label v-text="input.label" />
              <input
                v-model="input.value"
                type="text"
                class="w-full border-2 border-gray-200 rounded-md px-2 py-1 text-base"
                :placeholder="input.placeholder"
              />
            </div>
        </template>

        <button class="primary-button mt-5 w-full bg-primary text-secondary py-2 px-10" v-text="'Login'" />
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
      inputs: {
        domainUrl: {
          show: true,
          value: '',
          label: 'Freshdesk Domain Url:',
          placeholder: 'Your Freshdesk domain url...'
        },
        apiKey: {
          show: true,
          value: '',
          label: 'Freshdesk API Key:',
          placeholder: 'Your Freshdesk API key...'
        },
        email: {
          show: true,
          value: '',
          label: 'E-mail:',
          placeholder: 'john.doe@mail.com'
        },
        password:{
          show: true,
          value: '',
          label: 'Password:',
          placeholder: '********'
        }
      }
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

  mounted(){
    if(this.freshdeskDomainUrl){
      this.inputs.domainUrl.value = this.freshdeskDomainUrl
      this.inputs.domainUrl.show = false
    }
    if(this.freshdeskApiKey){
      this.inputs.apiKey.value = this.freshdeskApiKey
      this.inputs.apiKey.show = false
    }
  },

  methods: {
    authenticateWithFreshdesk() {
      axios.get('google')
    }
  }
})
</script>
