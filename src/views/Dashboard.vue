<template>
  <the-layout>
    <div class="flex items-center justify-between p-5 mb-3">
      <h1 class="text-4xl w-auto font-semibold opacity-70" v-text="'Freshdesk Ticket Dashboard'" />

      <dashboard-settings />
    </div>

    <div class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll px-5 scrollbar-hide">
      <ticket-count-section />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ticket-tags-section />
        <ticket-groups-section />
      </div>

      <ticket-list-section />
    </div>
  </the-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import TheLayout from '@/views/TheLayout.vue'
import DashboardSettings from '@/components/DashboardSettings.vue'
import TicketTagsSection from '@/components/TicketTagsSection.vue'
import TicketListSection from '@/components/TicketListSection.vue'
import TicketCountSection from '@/components/TicketCountSection.vue'
import TicketGroupsSection from '@/components/TicketGroupsSection.vue'

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
      tickets: [],
      keepFetching: true,
      startYear: new Date(import.meta.env.VITE_FRESHDESK_START_YEAR).toISOString()
    }
  },

  created() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }
  },

  mounted() {
    for (let i = 1; this.keepFetching; i++) {
      this.fetchTickets(i)
    }
  },

  methods: {
    fetchTickets(i) {
      this.tickets[i] = ApiCall.get(
        'tickets?updated_since=' + this.startYear + '&per_page=100&page=' + i
      )

      if (!this.tickets[i]?.length) {
        this.keepFetching = false
      }

      console.log(this.tickets)
    }
  }
})
</script>
