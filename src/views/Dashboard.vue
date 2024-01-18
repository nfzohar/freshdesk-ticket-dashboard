<template>
  <ticket-details-modal
    :key="detailsTicketId"
    :ticket-id="Number(detailsTicketId)"
    @modalClosed="detailsTicketId = null"
  />

  <the-layout :class="{ 'is-loading': isLoading }">
    <div
      class="flex flex-col md:flex-row items-center justify-between p-5 gap-y-5 mb-3 bg-transparent mr-"
    >
      <div class="w-full">
        <h1 class="text-xl md:text-4xl font-semibold" v-text="appTitle" />
        <h1
          :key="updateToken"
          class="font-semibold"
          v-text="'Ticket statistics since: ' + oldestTicketDate"
        />
      </div>

      <div class="flex items-center gap-x-5 justify-between w-full md:w-auto">
        <div class="flex items-center gap-x-5">
          <button
            class="primary-button w-36 text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600"
            v-text="'Refresh'"
            :title="'Refresh page'"
            @click.stop="loadTickets()"
          />
          <ticket-filter-modal />
        </div>
        <dashboard-settings @refreshDashboard="loadTickets()" :a-ticket="allTickets[0]" />
      </div>
    </div>

    <div class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll px-5 scrollbar-hide">
      <ticket-count-section v-if="layout.ticket_counts?.show" :tickets="allTickets" />

      <div
        v-if="typesTagsGroupsVisible"
        class="grid gap-5 grid-cols-1"
        :class="typesTagsGroupsClass"
      >
        <ticket-custom-field-section
          v-if="layout.types?.show"
          :tickets="allTickets"
          :custom-field="'type'"
          title="Ticket types"
        />
        <ticket-tags-section v-if="layout.tags?.show" :tickets="allTickets" />
        <ticket-groups-section v-if="layout.groups?.show" :tickets="allTickets" />
      </div>

      <div
        v-if="layout.ticket_open_closed_graph?.show"
        :key="updateToken"
        class="grid grid-cols-1 items-center gap-5"
      >
        <ticket-statistics-open-closed-graph
          :tickets="allTickets"
          :oldest-ticket="oldestTicketDate"
        />
      </div>

      <div class="grid grid-cols-1 gap-5" :class="{ 'sm:grid-cols-2': customFields?.length }">
        <top-requesters-section v-if="layout.top_requesters?.show" :tickets="allTickets" />
        <top-agents-section v-if="layout.top_agents?.show" :tickets="allTickets" />

        <ticket-custom-field-section
          v-for="(customField, cf) in customFields"
          :key="cf"
          :tickets="allTickets"
          :title="customField?.title"
          :custom-field="customField?.field"
        />
      </div>

      <ticket-list-section
        v-if="layout?.ticket_list?.show && allTickets?.length"
        :key="updateToken"
        :tickets-list="allTickets"
        @showTicketDetails="(value) => (detailsTicketId = value)"
      />
    </div>
  </the-layout>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import TheLayout from '@/views/TheLayout.vue'
import DashboardSettings from '@/components/DashboardSettings.vue'
import TicketFilterModal from '@/components/TicketFilterModal.vue'
import TopAgentsSection from '@/components/sections/TopAgentsSection.vue'
import TicketTagsSection from '@/components/sections/TicketTagsSection.vue'
import TicketListSection from '@/components/sections/TicketListSection.vue'
import TicketCountSection from '@/components/sections/TicketCountSection.vue'
import TicketGroupsSection from '@/components/sections/TicketGroupsSection.vue'
import TopRequestersSection from '@/components/sections/TopRequestersSection.vue'
import TicketDetailsModal from '@/components/subcomponents/TicketDetailsModal.vue'
import TicketCustomFieldSection from '@/components/sections/TicketCustomFieldSection.vue'
import TicketStatisticsOpenClosedGraph from '@/components/sections/TicketStatisticsOpenClosedGraph.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TheLayout,
    TopAgentsSection,
    TicketTagsSection,
    TicketListSection,
    TicketFilterModal,
    DashboardSettings,
    TicketCountSection,
    TicketDetailsModal,
    TicketGroupsSection,
    TopRequestersSection,
    TicketCustomFieldSection,
    TicketStatisticsOpenClosedGraph
  },

  data() {
    return {
      filters: [],
      tickets: [],
      updateToken: 0,
      startYear: null,
      isLoading: true,
      keepFetching: true,
      detailsTicketId: null,
      oldestTicketDate: new Date().toDateString()
    }
  },

  computed: {
    allTickets(): Object {
      return this.tickets.flat()
    },
    layout(): Object {
      return this.$dashboard?.dashboardLayout ?? []
    },
    customFields(): Object {
      return this.$dashboard?.storedCustomFields
    },
    appTitle(): String {
      return import.meta.env.VITE_APP_TITLE ?? 'Freshdesk Ticket Dashboard'
    },
    typesTagsGroupsVisible(): Number {
      return [this.layout?.types?.show, this.layout?.tags?.show, this.layout?.groups?.show].filter(
        (t) => t
      ).length
    },
    typesTagsGroupsClass(): String {
      return this.typesTagsGroupsVisible == 2
        ? 'sm:grid-cols-2'
        : this.typesTagsGroupsVisible == 3
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : 'flex'
    },
    customFieldsClass(): String {
      return this.customFields?.length == 2
        ? 'sm:grid-cols-2'
        : this.customFields?.length == 3
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : ''
    },
    apiCallUrl() {
      return this.$route.query.filters?.length
        ? 'tickets?query=' + this.$route.query.filters
        : 'tickets?updated_since=' + this.startYear
    }
  },

  created() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }

    this.startYear = new Date(import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '2023').toISOString()
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    }
  },

  async mounted() {
    await this.loadTickets()
  },

  methods: {
    async loadTickets() {
      this.isLoading = true
      this.keepFetching = true

      await this.fetchTicketsByPage()

      if (!this.keepFetching) {
        this.isLoading = false
        this.findOldestTicketDate()
      }
    },

    async fetchTicketsByPage() {
      this.tickets = []

      //for (let i = 1; this.keepFetching; i++) {
      for (let i = 1; i < 2; i++) {
        await this.fetchTickets(i)
        setTimeout(() => {}, 3000)
      }
      this.keepFetching = false
    },

    async fetchTickets(i) {
      await ApiCall.get(
        this.apiCallUrl + '&per_page=100&page=' + i + '&include=requester,stats'
      ).then((response) => {
        if (response) {
          this.tickets[i] = Object.values(response)
        }
      })

      if (!this.tickets[i]?.length) {
        this.keepFetching = false
      }
    },

    findOldestTicketDate() {
      let ticketCreationDates = this.allTickets.map((ticket) => ticket.created_at)

      ticketCreationDates = ticketCreationDates.sort(
        (date1, date2) => new Date(date1) - new Date(date2)
      )

      let dateFromArray = new Date(ticketCreationDates[0] ?? null)

      if (dateFromArray) {
        this.oldestTicketDate = format(dateFromArray, "eeee',' do MMMM y")
      }
    }
  }
})
</script>
