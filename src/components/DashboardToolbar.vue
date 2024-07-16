<template>
  <div
    class="w-full h-20 mb-5 px-1 border-b-2 border-primary-500 shadow-primary-500 transition-all"
    :class="[
      primaryColorText,
      textOnSecondaryColor,
      { 'sm:-mt-24 ': autoHide && !modalsOpen && !toolbarShow }
    ]"
    @mouseleave="hideTopBar"
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

      <div
        :key="Number(isLoading)"
        :class="`flex items-center mx-2 gap-3 justify-between w-max ${primaryColorText}`"
      >
        <button class="actions-button" :title="'Refresh page'" @click.stop="$emit('refresh')">
          <i :class="`fa fa-rotate ${isLoading ? 'animate-spin' : ''}`" />
        </button>

        <ticket-excel-exporter
          :all-tickets="allTickets"
          @startExport="$emit('startLoading')"
          @finishExport="$emit('stopLoading')"
        />

        <ticket-filter-modal
          @open="modalsOpen = true"
          @close="modalsOpen = false"
          @filtersUpdated="$emit('reload')"
        />

        <resolved-statistics-graph
          :tickets="allTickets"
          :last-ticket-date="lastTicketDate"
          :first-ticket-date="firstTicketDate"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
        <all-tickets-list
          :tickets="allTickets"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
        <dashboard-settings-modal
          @reloadDashboard="$emit('reload')"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />

        <help-section @open="modalsOpen = true" @close="modalsOpen = false" />
      </div>
    </div>
  </div>

  <div v-if="autoHide" class="absolute h-5 w-full bg-none" @mouseenter="toolbarShow = true" />
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import HelpSection from '@/components/HelpSection.vue'
import AllTicketsList from '@/components/AllTicketsList.vue'
import TicketFilterModal from '@/components/TicketFilters.vue'
import TicketExcelExporter from '@/components/TicketExcelExporter.vue'
import DashboardSettingsModal from '@/components/DashboardSettings.vue'
import ResolvedStatisticsGraph from '@/components/ResolvedStatisticsGraph.vue'

export default defineComponent({
  name: 'DashboardToolbar',

  props: {
    allTickets: {
      type: [Array, Object],
      required: true
    },
    isFetchingTickets: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  components: {
    HelpSection,
    AllTicketsList,
    TicketFilterModal,
    TicketExcelExporter,
    DashboardSettingsModal,
    ResolvedStatisticsGraph
  },

  emits: ['reload', 'refresh', 'startLoading', 'stopLoading'],

  data() {
    return {
      timeoutId: '',
      modalsOpen: false,
      toolbarShow: false,
      lastTicketDate: new Date().toDateString(),
      firstTicketDate: new Date().toDateString()
    }
  },

  watch: {
    'allTickets.length'() {
      this.findTicketCreationDates()
    },
    autoHide() {
      this.autoHide ? this.hideTopBar() : (this.toolbarShow = true)
    }
  },

  computed: {
    isLoading(): Boolean {
      return this.isFetchingTickets
    },
    autoHide(): Boolean {
      return this.$configuration?.autoHideToolbar
    },
    primaryColorText(): Boolean {
      return this.$information.textOnPrimaryColor
    },
    textOnSecondaryColor(): Boolean {
      return this.$information.textOnSecondaryColor
    },
    appTitle(): String {
      return import.meta.env.VITE_APP_TITLE ?? 'Freshdesk Ticket Dashboard'
    }
  },

  mounted() {
    this.hideTopBar()
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
    },

    hideTopBar() {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.toolbarShow = false
      }, 5000)
    }
  }
})
</script>
