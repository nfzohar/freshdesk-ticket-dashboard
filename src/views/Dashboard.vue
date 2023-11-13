<template>
  <the-layout>
    <div>
      <h1 class="p-5 text-4xl font-semibold opacity-70" v-text="'Freshdesk Ticket Dashboard'" />

      <!-- <dqshboard-settings /> -->
    </div>

    <div class="flex flex-col gap-y-4 w-full h-screen overflow-y-scroll px-5 pt-4">
      <ticket-count-statistics-section />
      <ticket-tag-statistics-section />

      <!-- <ticket-group-statistics-section /> -->

      <div class="w-full px-24 border-2 border-primary m-auto">
        <a-ticket v-for="(ticket, t) in tickets" :key="t" :ticket="ticket" />
      </div>
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheLayout from './TheLayout.vue'
import ApiCall from '@/helpers/APICallHelper'
import ATicket from '@/components/ATicket.vue'
import TicketTagStatisticsSection from '/src/components/TicketTagStatisticsSection.vue'
import TicketCountStatisticsSection from '/src/components/TicketCountStatisticsSection.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    ATicket,
    TheLayout,
    TicketTagStatisticsSection,
    TicketCountStatisticsSection
  },

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
