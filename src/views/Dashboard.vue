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
        <h1
          :key="updateToken"
          class="font-semibold"
          v-text="'Ticket statistics since: ' + oldestTicketDate"
        />
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
        v-if="(showTicketTags || showTicketTypes || showTicketGroups)"
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
          'sm:grid-cols-2': (showTopRequesters && showTopAgents) || customFields?.length > 1
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
import { useToast } from 'vue-toastification'
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
      filters: [],
      tickets: [],
      apiCallUrl: '',
      updateToken: 0,
      reloadToken: 0,
      startYear: null,
      isLoading: true,
      keepFetching: true,
      detailsTicketId: null,
      oldestTicketDate: new Date().toDateString()
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

      if (!this.keepFetching) {
        this.isLoading = false

        if (this.tickets?.length) {
          this.findOldestTicketDate()
        } else {
          useToast().error('No ticket to display found.')
        }
      }
    },

    loadFilteredTickets() {
      this.apiCallUrl = 'search/tickets?query="' + this.$store.filters + '"'
    },

    async fetchTicketsByPage() {
      this.tickets = []

      for (let i = 1; this.keepFetching; i++) {
      // for (let i = 1; i < 2; i++) {
        await this.fetchTickets(i)
        setTimeout(() => {}, 3000)
      }
      this.keepFetching = false
    },

    async fetchTickets(i) {
      await ApiCall.get(this.apiCallUrl + '&page=' + i).then((response) => {
        if (response) {
          this.tickets[i] = Object.values(response.results ?? response)
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
