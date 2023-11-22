<template>
  <the-layout :key="updateToken" :class="{ 'is-loading': isLoading }">
    <div
      class="flex flex-col md:flex-row items-center justify-between p-5 gap-y-5 mb-3 bg-transparent"
    >
      <div class="w-full">
        <h1 class="text-4xl font-semibold" v-text="'Freshdesk Ticket Dashboard'" />
        <h1 class="font-semibold" v-text="'Ticket statistics since: ' + oldestTicketDate" />
      </div>

      <div class="flex items-center gap-x-5 justify-between w-full md:w-auto">
        <div class="flex items-center gap-x-5">
          <button
            class="primary-button w-36 text-center bg-primary-500 border-none hover:bg-primary-600 py-2 px-10 shadow-md shadow-primary-600"
            v-text="'Refresh'"
            :title="'Refresh page'"
            @click.stop="loadTickets()"
          />
          <ticket-filter-section :filters-list="filters" />
        </div>
        <dashboard-settings />
      </div>
    </div>

    <div
      class="flex flex-col gap-y-5 w-full h-screen overflow-y-scroll px-5 scrollbar-hide"
      v-if="allTickets.length"
    >
      <ticket-count-section
        v-if="layout.ticket_counts"
        :tickets="allTickets"
        :status-options="statuses"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start gap-4">
        <ticket-custom-field-section
          :tickets="allTickets"
          :custom-field="'type'"
          title="Ticket types"
        />
        <ticket-tags-section v-if="layout.tags" :tags="allTicketTags" />
        <ticket-groups-section v-if="layout.groups" :groups="groups" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <top-requesters-section :tickets="allTickets" />
        <top-agents-section :tickets="allTickets" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <ticket-custom-field-section
          :tickets="allTickets"
          :custom-field="'type'"
          title="Ticket types"
        />
      </div>

      <ticket-list-section
        v-if="layout.ticket_list"
        :tickets-list="allTickets"
        :statuses="statuses"
      />
    </div>
  </the-layout>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import ApiCall from '@/helpers/APICallHelper'
import TheLayout from '@/views/TheLayout.vue'
import TopAgentsSection from '@/components/TopAgentsSection.vue'
import DashboardSettings from '@/components/DashboardSettings.vue'
import TicketTagsSection from '@/components/TicketTagsSection.vue'
import TicketListSection from '@/components/TicketListSection.vue'
import TicketCountSection from '@/components/TicketCountSection.vue'
import TicketGroupsSection from '@/components/TicketGroupsSection.vue'
import TicketFilterSection from '@/components/TicketFilterSection.vue'
import TopRequestersSection from '@/components/TopRequestersSection.vue'
import TicketCustomFieldSection from '@/components/TicketCustomFieldSection.vue'

export default defineComponent({
  name: 'TheDashboard',

  components: {
    TheLayout,
    TopAgentsSection,
    TicketTagsSection,
    TicketListSection,
    DashboardSettings,
    TicketCountSection,
    TicketGroupsSection,
    TicketFilterSection,
    TopRequestersSection,
    TicketCustomFieldSection
  },

  data() {
    return {
      tags: [],
      groups: [],
      filters: [],
      tickets: [],
      updateToken: 0,
      startYear: null,
      isLoading: true,
      keepFetching: true,
      oldestTicketDate: new Date().toDateString()
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
    },
    statuses() {
      return this.filters.filter((filter) => filter.name == 'status').choices
    }
  },

  created() {
    if (!this.$store.authenticated) {
      this.$router.push('/')
    }
    this.startYear = new Date(import.meta.env.VITE_FRESHDESK_START_YEAR ?? '').toISOString()
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
      this.fetchAllTicketFields()
      await this.fetchTickets(1)
      this.isLoading = false

      /*this.isLoading = true
      this.keepFetching = true

      this.fetchAllTicketFields()
      await this.fetchTicketsByPage()

      this.getTicketGroups()
      this.findOldestTicketDate()

      if (!this.keepFetching) {
        this.isLoading = false
      }*/
    },

    async fetchTicketsByPage() {
      this.tickets = []

      for (let i = 1; this.keepFetching; i++) {
        await this.fetchTickets(i)
        setTimeout(() => {}, 3000)
      }
    },

    async fetchTickets(i) {
      await ApiCall.get(
        'tickets?updated_since=' + this.startYear + '&per_page=100&page=' + i + '&include=requester'
      ).then((response) => {
        if (response) {
          this.tickets[i] = Object.values(response)
        }
      })

      if (!this.tickets[i]?.length) {
        this.keepFetching = false
      }
    },

    async getTicketGroups() {
      let groupsList = []

      await ApiCall.get('groups?per_page=100')
        .then((response) => {
          if (response) {
            Object.values(response).forEach((group) => {
              if (group) {
                let aGroup = group

                aGroup['ticket_count'] = this.allTickets.filter(
                  (ticket) => ticket.group_id == group.id
                ).length

                groupsList.push(aGroup)
              }
            })
          }
        })
        .then(() => {
          this.groups = groupsList
        })
    },

    findOldestTicketDate() {
      let ticketCreationDates = this.allTickets
        .map((ticket) => ticket.created_at)
        .sort((date1, date2) => new Date(date1) > new Date(date2))

      let dateFromArray = new Date(ticketCreationDates[0])

      if (dateFromArray) {
        this.oldestTicketDate = format(dateFromArray, "eeee',' do MMMM y")
      }
    },

    async fetchAllTicketFields() {
      await ApiCall.get('admin/ticket_fields').then((response) => {
        if (response) {
          let filterIDs = Object.values(response).map((filter) => filter.id)

          filterIDs.forEach((id) => {
            this.fetchTicketFIeldOptions(id)
          })
        }
      })
    },

    async fetchTicketFIeldOptions(filterId) {
      await ApiCall.get('admin/ticket_fields/' + filterId + '?include=section').then((response) => {
        if (response) {
          if (response) {
            this.filters.push(response)
          }
        }
      })
    }
  }
})
</script>
