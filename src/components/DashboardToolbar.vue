<template>
  <div
    class="w-full h-20 mb-5 px-1 border-b-2 border-primary-500 shadow-primary-500 transition-all"
    :class="[{ 'sm:-mt-24 ': autoHide }, primaryColorText, textOnSecondaryColor]"
  >
    <div class="flex flex-row items-center justify-between gap-y-2 py-3 px-1 w-full rounded-md">
      <div :class="textOnSecondaryColor">
        <h1
          class="text-base sm:text-xl md:text-2xl font-bold w-max text-center"
          v-text="appTitle"
        />
        <span
          class="text-xs sm:text-sm w-1/2 sm:w-max md:flex md:text-sm font-semibold items-center text-center gap-x-2"
          v-text="`Tickets from ${firstTicketDate} to ${lastTicketDate}`"
        />
      </div>

      <div :class="`flex items-center mx-2 gap-3 justify-between w-max ${primaryColorText}`">
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

        <!-- <ticket-filter-modal @filtersApply="$emit('reload')" @filtersReset="$emit('reload')" /> -->

        <open-closed-statistics-graph-modal :all-tickets="allTickets" />

        <all-tickets-list
          :all-tickets="allTickets"
          @showTicketDetails="(value) => (detailsTicketId = value)"
        />

        <dashboard-settings-modal @reloadDashboard="$emit('reload')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import AllTicketsList from '@/components/AllTicketsList.vue'
// import TicketFilterModal from '@/components/TicketFilters.vue'
import TicketExcelExporter from '@/components/TicketExcelExporter.vue'
import DashboardSettingsModal from '@/components/DashboardSettings.vue'
import OpenClosedStatisticsGraphModal from '@/components/OpenClosedStatisticsGraphModal.vue'

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
    // TicketFilterModal,
    TicketExcelExporter,
    DashboardSettingsModal,
    OpenClosedStatisticsGraphModal
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
    primaryColorText(): Boolean {
      return this.$information.textOnPrimaryColor
    },
    textOnSecondaryColor(): Boolean {
      return this.$information.textOnSecondaryColor
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
