<template>
  <the-layout>
    <div class="flex flex-col">
      <div class="w-full px-24 border-2 border-primary m-auto">
        <span
          v-for="(ticket, t) in tickets"
          :key="t"
          class="block m-auto border p-2"
          v-text="ticket.subject"
        />
      </div>
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheLayout from './TheLayout.vue'
import ApiCall from '@/helpers/APICallHelper'

export default defineComponent({
  name: 'TheDashboard',

  components: { TheLayout },

  emits: [],

  data() {
    return {
      tickets: ['1']
    }
  },

  created() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }
  },

  mounted() {
    this.loadTickets()
  },

  methods: {
    loadTickets() {
      this.tickets = ApiCall.get('tickets')
      console.log(this.tickets)
    }
  }
})
</script>
