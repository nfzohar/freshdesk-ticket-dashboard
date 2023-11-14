<template>
  <the-layout>
    <div class="flex items-center justify-between p-5">
      <h1 class="text-4xl font-semibold opacity-70" v-text="'Freshdesk Ticket Dashboard'" />
      <dashboard-settings />
    </div>

    <div class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll p-5 scrollbar-hide">
      <ticket-count-section />

      <div class="grid grid-cols-2 gap-4">
        <ticket-tags-section />
        <ticket-groups-section />
      </div>

      <ticket-list-section />
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheLayout from './TheLayout.vue'
import ApiCall from '@/helpers/APICallHelper'
import TicketTagsSection from '/src/components/TicketTagsSection.vue'
import TicketListSection from '/src/components/TicketListSection.vue'
import TicketCountSection from '/src/components/TicketCountSection.vue'
import TicketGroupsSection from '/src/components/TicketGroupsSection.vue'
import DashboardSettings from '/src/components/subcomponents/DashboardSettings.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TheLayout,
    TicketTagsSection,
    TicketListSection,
    DashboardSettings,
    TicketCountSection,
    TicketGroupsSection
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
