<template>
  <ticket-details-modal
    :key="String(detailsTicketId)"
    :ticket-id="Number(detailsTicketId)"
    @modalClosed="detailsTicketId = null"
  />

  <the-layout :key="reloadToken" :class="{ 'is-loading': isLoading }">
    <div
      class="flex flex-col md:flex-row items-center justify-between p-5 gap-y-5 mb-3 bg-transparent mr-"
    >
      <div class="w-full">
        <h1 class="text-xl md:text-4xl font-semibold" v-text="appTitle" />
        <h1 :key="updateToken" class="flex items-center gap-x-2">
          Ticket statistics from: <b v-text="oldestTicketDate" /> to
          <b v-text="youngestTicketDate" />
        </h1>
      </div>

      <div class="flex items-center gap-x-5 justify-between w-full md:w-auto">
        <div class="flex items-center gap-x-5">
          <button
            class="primary-button text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-3 shadow-md shadow-primary-600 h-10 w-auto"
            :title="'Refresh page'"
            @click.stop="loadTickets()"
          >
            <reload-icon :pt-height="'20'" :pt-width="'20'" />
          </button>

          <ticket-filter-modal
            @filtersApply="loadFilteredTickets()"
            @filtersReset="apiCallUrl = ''"
          />
        </div>
        <dashboard-settings
          @refreshDashboard="loadTickets()"
          @reloadDashboard="reloadToken++"
          :a-ticket="allTickets[0]"
        />
      </div>
    </div>

    <div class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll px-5 scrollbar-hide">
      <ticket-count-section v-if="showTicketCounts" :tickets="allTickets" />

      <div
        v-if="showTicketTags || showTicketTypes || showTicketGroups"
        class="grid gap-5 grid-cols-1"
        :class="typesTagsGroupsClass"
      >
        <ticket-custom-field-section
          v-if="showTicketTypes"
          :tickets="allTickets"
          :custom-field="'type'"
          title="Ticket types"
        />
        <ticket-tags-section v-if="showTicketTags" :tickets="allTickets" />
        <ticket-groups-section v-if="showTicketGroups" :tickets="allTickets" />
      </div>

      <!-- WORK IN PROGRESS
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
      -->

      <div
        class="grid grid-cols-1 gap-5"
        :class="{
          'sm:grid-cols-2': showTopRequesters || showTopAgents || customFields?.length > 1
        }"
      >
        <top-requesters-section v-if="showTopRequesters" :tickets="allTickets" />
        <top-agents-section v-if="showTopAgents" :tickets="allTickets" />
        <ticket-custom-field-section
          v-for="(customField, cf) in customFields"
          :key="cf"
          :tickets="allTickets"
          :title="customField?.title"
          :custom-field="customField?.field"
        />
      </div>

      <ticket-list-section
        v-if="showTicketList && allTickets?.length"
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
import ReloadIcon from '@/components/icons/ReloadIcon.vue'
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
// import TicketStatisticsOpenClosedGraph from '@/components/sections/TicketStatisticsOpenClosedGraph.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TheLayout,
    ReloadIcon,
    TopAgentsSection,
    TicketTagsSection,
    TicketListSection,
    TicketFilterModal,
    DashboardSettings,
    TicketCountSection,
    TicketDetailsModal,
    TicketGroupsSection,
    TopRequestersSection,
    TicketCustomFieldSection
    // TicketStatisticsOpenClosedGraph
  },

  data() {
    return {
      page: 1,
      filters: [],
      tickets: [],
      apiCallUrl: '',
      updateToken: 0,
      reloadToken: 0,
      startYear: null,
      isLoading: true,
      keepFetching: true,
      detailsTicketId: null,
      oldestTicketDate: new Date().toDateString(),
      youngestTicketDate: new Date().toDateString()
    }
  },

  computed: {
    showTicketTags() {
      return this.layout.tags?.show
    },
    showTicketTypes() {
      return this.layout.types?.show
    },
    showTicketGroups() {
      return this.layout.groups?.show
    },
    showTopAgents() {
      return this.layout.top_agents?.show
    },
    showTicketList() {
      return this.layout.ticket_list?.show
    },
    showTicketCounts() {
      return this.layout.ticket_counts?.show
    },
    showTopRequesters() {
      return this.layout.top_requesters?.show
    },
    allTickets(): Object {
      return this.tickets?.flat()
    },
    customFields(): Object {
      return this.$dashboard?.storedCustomFields
    },
    layout(): Object {
      return this.$dashboard?.dashboardLayout ?? []
    },
    appTitle(): String {
      return import.meta.env.VITE_APP_TITLE ?? 'Freshdesk Ticket Dashboard'
    },
    typesTagsGroupsVisible(): Number {
      return [this.showTicketTags, this.showTicketTypes, this.showTicketGroups].filter((t) => t)
        .length
    },
    typesTagsGroupsClass(): String {
      switch (this.typesTagsGroupsVisible) {
        case 2: {
          return 'sm:grid-cols-2'
        }
        case 3: {
          return 'sm:grid-cols-2 md:grid-cols-3'
        }
        default: {
          return 'flex'
        }
      }
    },
    customFieldsClass(): String {
      return this.customFields?.length == 2
        ? 'sm:grid-cols-2'
        : this.customFields?.length == 3
        ? 'sm:grid-cols-2 md:grid-cols-3'
        : ''
    }
  },

  watch: {
    'allTickets.length'() {
      this.updateToken++
    },
    apiCallUrl() {
      this.loadTickets()
    }
  },

  created() {
    this.startYear = new Date(import.meta.env?.VITE_FRESHDESK_START_YEAR ?? '2023').toISOString()
  },

  async mounted() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }

    await this.loadTickets()
  },

  methods: {
    async loadTickets() {
      this.isLoading = true
      this.keepFetching = true

      // Set default api call if not set
      if (!this.apiCallUrl) {
        this.apiCallUrl =
          'tickets?updated_since=' + this.startYear + '&include=requester,stats&per_page=100'
      }

      await this.fetchTicketsByPage()
    },

    loadFilteredTickets() {
      this.apiCallUrl = 'search/tickets?query="' + this.$store.filters + '"'
    },

    async fetchTicketsByPage() {
      this.tickets = []
      this.page = 1

      try {
        await this.fetchTickets()
      } catch (error) {
        this.keepFetching = false
        this.isLoading = false
      }
    },

    async fetchTickets() {
      await ApiCall.get(this.apiCallUrl + '&page=' + this.page).then((response) => {
        if (response) {
          this.tickets[this.page] = Object.values(response.results ?? response)
        }

        if (!this.tickets[this.page]?.length) {
          this.keepFetching = false
          this.isLoading = false

          if (this.tickets?.length) {
            this.findFirstLastTicketDate()
          } else {
            this.$toast.error('No ticket to display found.')
          }
        }

        if (this.keepFetching) {
          this.page++
          setTimeout(() => {
            this.fetchTickets()
          }, 6000)
        }
      })
    },

    epochDateForm(date: Date) {
      return (date.getTime() - date.getMilliseconds()) / 1000
    },

    findFirstLastTicketDate() {
      let ticketCreationDates = this.allTickets.map(
        (ticket: { created_at: String }) => new Date(ticket.created_at)
      )

      ticketCreationDates = ticketCreationDates.filter((date) => date)

      ticketCreationDates = ticketCreationDates.sort(
        (date1: Date, date2: Date) => this.epochDateForm(date1) - this.epochDateForm(date2)
      )

      let dateFromArray = new Date(ticketCreationDates[0] ?? null)
      let dateToArray = new Date(ticketCreationDates[ticketCreationDates.length - 1] ?? null)

      if (dateFromArray) {
        this.oldestTicketDate = format(dateFromArray, "eeee',' do MMMM y")
      }
      if (dateToArray) {
        this.youngestTicketDate = format(dateToArray, "eeee',' do MMMM y")
      }
    }
  }
})
</script>
