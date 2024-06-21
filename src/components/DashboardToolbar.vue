<template>
  <ticket-details-modal
    :key="Number(detailsTicketId)"
    :ticket-id="Number(detailsTicketId)"
    @modalClosed="detailsTicketId = null"
  />

  <div
    class="w-full h-20 mb-4 px-1 border-b-2 border-primary-500 shadow-primary-500 transition-all"
    :class="[
      { 'sm:-mt-24 ': autoHide },
      `text-${primaryColorIsDark ? 'white' : 'black'}`,
      `bg-secondary-${secondaryColorIsDark ? '600' : '400'}`
    ]"
  >
    <div class="flex flex-row items-center justify-between gap-y-2 py-3 px-1 w-full rounded-md">
      <div :class="`text-${secondaryColorIsDark ? 'white' : 'black'}`">
        <h1
          class="text-base sm:text-xl md:text-2xl font-bold w-max text-center"
          v-text="appTitle"
        />
        <span
          class="text-xs sm:text-sm w-1/2 sm:w-max md:flex md:text-sm font-semibold items-center text-center gap-x-2"
          v-text="`Tickets from ${firstTicketDate} to ${lastTicketDate}`"
        />
      </div>

      <div class="flex items-center mx-1 gap-3 justify-between w-max">
        <button
          class="actions-button"
          :title="'Refresh page'"
          :key="Number(loadingState)"
          @click.stop="$emit('refresh')"
        >
          <i class="fa fa-rotate" :class="{ loadingState: 'animate-spin' }" />
        </button>

        <ticket-excel-exporter
          :all-tickets="allTickets"
          @startExport="$emit('startLoading')"
          @finishExport="$emit('stopLoading')"
        />

        <all-tickets-list
          :all-tickets="allTickets"
          @showTicketDetails="(value) => (detailsTicketId = value)"
        />

        <!-- <ticket-filter-modal
            @filtersApply="loadFilteredTickets()"
            @filtersReset="apiCallUrl = ''"
          /> -->

        <dashboard-settings-modal
          @refreshDashboard="$emit('refresh')"
          @reloadDashboard="$emit('reload')"
          :a-ticket="allTickets[0]"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import AllTicketsList from '@/components/AllTicketsList.vue'
import TicketFilterModal from '@/components/TicketFilters.vue'
import TicketDetailsModal from '@/components/TicketDetailedView.vue'
import TicketExcelExporter from '@/components/TicketExcelExporter.vue'
import DashboardSettingsModal from '@/components/DashboardSettings.vue'

export default defineComponent({
  name: 'DashboardToolbar',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    autoHide: {
      type: Boolean,
      required: true
    }
  },

  components: {
    AllTicketsList,
    TicketFilterModal,
    TicketDetailsModal,
    TicketExcelExporter,
    DashboardSettingsModal
  },

  emits: ['reload', 'refresh', 'startLoading', 'stopLoading'],

  data() {
    return {
      detailsTicketId: null,
      loadingState: this.loading,
      lastTicketDate: new Date().toDateString(),
      firstTicketDate: new Date().toDateString()
    }
  },

  watch: {
    'allTickets.length'() {
      this.findTicketCreationDates()
    }
  },

  computed: {
    appTitle(): String {
      return import.meta.env.VITE_APP_TITLE ?? 'Freshdesk Ticket Dashboard'
    },
    primaryColorIsDark(): Boolean {
      return this.$information.isPrimaryColorDark
    },
    secondaryColorIsDark(): Boolean {
      return this.$information.isSecondaryColorDark
    }
  },

  methods: {
    findTicketCreationDates() {
      let ticketCreationDates = this.allTickets
        .map((ticket: { created_at: String }) => new Date(ticket?.created_at))
        .filter((date) => date)

      ticketCreationDates = ticketCreationDates.sort(
        (date1: Date, date2: Date) => this.epochDateForm(date1) - this.epochDateForm(date2)
      )

      let dateFromArray = new Date(ticketCreationDates[0] ?? null)
      let dateToArray = new Date(ticketCreationDates[ticketCreationDates.length - 1] ?? null)

      if (dateFromArray) {
        this.firstTicketDate = format(dateFromArray, "eeee',' do MMMM y")
      }
      if (dateToArray) {
        this.lastTicketDate = format(dateToArray, "eeee',' do MMMM y")
      }
    },

    epochDateForm(date: Date) {
      return (date.getTime() - date.getMilliseconds()) / 1000
    }
  }
})
</script>
