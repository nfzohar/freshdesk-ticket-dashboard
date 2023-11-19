<template>
  <the-layout :key="updateToken">
    <div class="flex items-center justify-between p-5 mb-3 bg-transparent">
      <h1 class="text-4xl w-auto font-semibold opacity-70" v-text="'Freshdesk Ticket Dashboard'" />
      <dashboard-settings />
    </div>

    <div class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll px-5 scrollbar-hide">
      <ticket-count-section v-if="layout.ticket_counts" />

      <div class="flex flex-col md:flex-row items-start gap-4">
        <ticket-tags-section v-if="layout.tags" :tags="allTicketTags" />
        <ticket-groups-section v-if="layout.groups" :groups="groups" />
      </div>

      <ticket-filter-section />
      <ticket-list-section v-if="layout.ticket_list" :tickets-list="allTickets" />
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
import TicketFilterSection from '@/components/TicketFilterSection.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TheLayout,
    TicketTagsSection,
    TicketListSection,
    DashboardSettings,
    TicketCountSection,
    TicketGroupsSection,
    TicketFilterSection
  },

  data() {
    return {
      tags: [],
      groups: [],
      tickets: [],
      updateToken: 0,
      keepFetching: true,
      startYear: new Date(import.meta.env.VITE_FRESHDESK_START_YEAR).toISOString()
    }
  },

  computed: {
    layout() {
      return this.$dashboard.$state.layout
    },
    allTickets() {
      return this.tickets.flat()
    },
    allTicketTags() {
      return this.allTickets.map((ticket) => ticket.tags)
    }
  },

  created() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    }
  },

  async mounted() {
    //for (let i = 1; this.keepFetching; i++) {
    await this.fetchTickets(1)
    //}

    this.getTicketGroups()
  },

  methods: {
    async fetchTickets(i) {
      await ApiCall.get('tickets?updated_since=' + this.startYear + '&per_page=100&page=' + i).then(
        (response) => {
          this.tickets[i] = Object.values(response)
        }
      )

      if (!this.tickets[i]?.length) {
        this.keepFetching = false
      }
    },

    async getTicketGroups() {
      let groupsList = []

      await ApiCall.get('groups?per_page=100').then((response) => {
        Object.values(response).forEach((group) => {
          let aGroup = group

          aGroup['ticket_count'] = this.allTickets.filter(
            (ticket) => ticket.group_id == group.id
          ).length

          groupsList.push(aGroup)
        })
      })

      this.groups = groupsList
    }
  }
})
</script>
