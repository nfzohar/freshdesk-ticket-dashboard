<template>
  <header
    class="relative z-20 w-full h-28 md:h-16 shrink-0 border-b border-line bg-surface/80 backdrop-blur transition-[margin] duration-300"
    :class="{ '-mt-28 md:-mt-16': autoHide && !modalsOpen && !toolbarShow }"
    @mouseleave="hideTopBar"
  >
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-2 h-full px-4 py-2 md:py-0"
    >
      <div class="flex items-center gap-3 min-w-0 max-w-full">
        <span
          class="hidden sm:grid place-items-center h-9 w-9 shrink-0 rounded-lg bg-primary-500 text-on-primary"
        >
          <i class="fa fa-chart-simple" />
        </span>
        <div class="min-w-0 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <h1 class="truncate text-base font-semibold leading-5" v-text="appTitle" />
            <span
              v-if="resultsTruncated"
              class="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
              :title="'Freshdesk search results are capped at 300 tickets. Showing a partial result — refine your filters to see everything.'"
            >
              <i class="fa fa-triangle-exclamation" />
              Partial results
            </span>
          </div>
          <p
            class="truncate text-xs text-ink-muted"
            v-text="`Tickets from ${firstTicketDate} to ${lastTicketDate}`"
          />
        </div>
      </div>

      <nav :key="Number(isLoading)" class="flex items-center gap-1" :aria-label="'Dashboard tools'">
        <button class="actions-button" :title="'Refresh tickets'" @click.stop="$emit('refresh')">
          <i :class="`fa fa-rotate ${isLoading ? 'animate-spin' : ''}`" />
        </button>

        <ticket-filter-modal
          @open="modalsOpen = true"
          @close="modalsOpen = false"
          @filtersUpdated="$emit('refresh')"
        />
        <all-tickets-list
          :tickets="allTickets"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
        <open-tickets-graph
          :tickets="allTickets"
          :last-ticket-date="lastTicketDate"
          :first-ticket-date="firstTicketDate"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
        <resolved-statistics-graph
          :tickets="allTickets"
          :last-ticket-date="lastTicketDate"
          :first-ticket-date="firstTicketDate"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
        <ticket-excel-exporter
          :all-tickets="allTickets"
          @startExport="$emit('startLoading')"
          @finishExport="$emit('stopLoading')"
        />

        <span class="mx-1 h-6 w-px bg-line" aria-hidden="true" />

        <button
          class="actions-button hidden md:inline-grid"
          :title="'Edit layout: move, resize, add and remove panels'"
          @click="$emit('editLayout')"
        >
          <i class="fa fa-pen-ruler" />
        </button>
        <theme-toggle />
        <help-section @open="modalsOpen = true" @close="modalsOpen = false" />
        <dashboard-settings-modal
          @reloadDashboard="$emit('reload')"
          @openWizard="$emit('openWizard')"
          @editLayout="$emit('editLayout')"
          @refetch="$emit('refetch')"
          @open="modalsOpen = true"
          @close="modalsOpen = false"
        />
      </nav>
    </div>
  </header>

  <div
    v-if="autoHide"
    class="absolute top-0 z-10 h-4 w-full bg-none"
    @mouseenter="toolbarShow = true"
  />
</template>

<script lang="ts">
import { format } from 'date-fns'
import { defineComponent, type PropType } from 'vue'
import HelpSection from '@/components/HelpSection.vue'
import ThemeToggle from '@/components/general/ThemeToggle.vue'
import AllTicketsList from '@/components/AllTicketsList.vue'
import TicketFilterModal from '@/components/TicketFilters.vue'
import OpenTicketsGraph from '@/components/OpenTicketsGraph.vue'
import TicketExcelExporter from '@/components/TicketExcelExporter.vue'
import DashboardSettingsModal from '@/components/DashboardSettings.vue'
import ResolvedStatisticsGraph from '@/components/ResolvedStatisticsGraph.vue'

export default defineComponent({
  name: 'DashboardToolbar',

  props: {
    allTickets: {
      type: Array as PropType<any[]>,
      required: true
    },
    isFetchingTickets: {
      type: Boolean,
      required: true,
      default: false
    },
    resultsTruncated: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  components: {
    HelpSection,
    ThemeToggle,
    AllTicketsList,
    OpenTicketsGraph,
    TicketFilterModal,
    TicketExcelExporter,
    DashboardSettingsModal,
    ResolvedStatisticsGraph
  },

  emits: [
    'reload',
    'refresh',
    'startLoading',
    'stopLoading',
    'openWizard',
    'refetch',
    'editLayout'
  ],

  data() {
    return {
      timeoutId: undefined as ReturnType<typeof setTimeout> | undefined,
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
    isLoading(): boolean {
      return this.isFetchingTickets
    },
    autoHide(): boolean {
      return this.$configuration?.autoHideToolbar
    },
    primaryColorText(): string {
      return this.$information.textOnPrimaryColor
    },
    textOnSecondaryColor(): string {
      return this.$information.textOnSecondaryColor
    },
    appTitle(): string {
      return import.meta.env.VITE_APP_TITLE || 'Freshdesk Ticket Dashboard'
    }
  },

  mounted() {
    this.hideTopBar()
  },

  methods: {
    findTicketCreationDates() {
      let ticketCreationDates = this.allTickets
        .map((ticket: { created_at: string }) => new Date(ticket?.created_at))
        .filter((date: any) => date)

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
